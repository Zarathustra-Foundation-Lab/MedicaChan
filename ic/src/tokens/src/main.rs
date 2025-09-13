use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;

// Standard ICRC-1 Types
type Account = (Principal, u32);
type Subaccount = [u8; 32];
type BlockIndex = u64;

#[derive(CandidType, Deserialize)]
pub enum TransactionError {
    BadFee,
    CreatedInFuture { ledger_time: u64 },
    TooOld,
    Expired,
    Duplicate { duplicate_of: BlockIndex },
    TemporarilyUnavailable,
    InsufficientFunds { balance: u128 },
}

#[derive(CandidType, Deserialize)]
pub struct TransferArg {
    pub from_subaccount: Option<Subaccount>,
    pub to: Account,
    pub amount: u128,
    pub fee: Option<u128>,
    pub memo: Option<Memo>,
    pub created_at_time: Option<u64>,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct TransferResult {
    pub Ok: BlockIndex,
    pub Err: TransactionError,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct AccountBalanceArgs {
    pub account: Account,
}

#[derive(CandidType, Deserialize)]
pub struct Transaction {
    pub operation: Operation,
    pub created_at_time: u64,
    pub caller: Principal,
    pub memo: Option<Memo>,
}

#[derive(CandidType, Deserialize)]
pub enum Operation {
    Transfer {
        from: Account,
        to: Account,
        amount: u128,
        fee: u128,
    },
    Mint {
        to: Account,
        amount: u128,
    },
    Burn {
        from: Account,
        amount: u128,
        memo: Option<Memo>,
    },
}

pub type Memo = serde_bytes::ByteBuf;

// Metadata
pub type MetadataValue = candid::parser::value::Value;

// Contract State
thread_local! {
    static LEDGER: RefCell<Ledger> = RefCell::new(Ledger::new());
    static METADATA: RefCell<Vec<(String, MetadataValue)>> = RefCell::new(vec![]);
}

pub struct Ledger {
    balances: HashMap<Account, u128>,
    transactions: Vec<Transaction>,
    total_supply: u128,
}

impl Ledger {
    pub fn new() -> Self {
        Self {
            balances: HashMap::new(),
            transactions: Vec::new(),
            total_supply: 0,
        }
    }

    pub fn transfer(&mut self, arg: TransferArg) -> Result<BlockIndex, TransactionError> {
        // Get sender and recipient
        let from = (ic_cdk::caller(), arg.from_subaccount.unwrap_or_default());
        let to = arg.to;

        // Validate amount
        if arg.amount == 0 {
            return Err(TransactionError::BadFee);
        }

        // Get fee
        let fee = arg.fee.unwrap_or(DEFAULT_TRANSFER_FEE);

        // Check sender balance
        let sender_balance = self.balances.get(&from).copied().unwrap_or(0);
        let total_amount = arg.amount + fee;

        if sender_balance < total_amount {
            return Err(TransactionError::InsufficientFunds {
                balance: sender_balance,
            });
        }

        // Update balances
        if sender_balance == total_amount {
            self.balances.remove(&from);
        } else {
            *self.balances.entry(from).or_insert(0) -= total_amount;
        }

        *self.balances.entry(to).or_insert(0) += arg.amount;

        // Record transaction fee
        *self.balances.entry(LEDGER_FEE_ACCOUNT).or_insert(0) += fee;

        // Create transaction record
        let transaction = Transaction {
            operation: Operation::Transfer {
                from,
                to,
                amount: arg.amount,
                fee,
            },
            created_at_time: time(),
            caller: ic_cdk::caller(),
            memo: arg.memo,
        };

        self.transactions.push(transaction);
        self.total_supply += arg.amount;

        Ok((self.transactions.len() - 1) as BlockIndex)
    }

    pub fn account_balance(&self, args: AccountBalanceArgs) -> u128 {
        self.balances.get(&args.account).copied().unwrap_or(0)
    }

    pub fn mint(&mut self, to: Account, amount: u128) -> BlockIndex {
        *self.balances.entry(to).or_insert(0) += amount;
        self.total_supply += amount;

        let transaction = Transaction {
            operation: Operation::Mint { to, amount },
            created_at_time: time(),
            caller: ic_cdk::caller(),
            memo: None,
        };

        self.transactions.push(transaction);
        (self.transactions.len() - 1) as BlockIndex
    }
}

// Constants
const DEFAULT_TRANSFER_FEE: u128 = 10_000;
const LEDGER_FEE_ACCOUNT: Account = (Principal::anonymous(), 0);
pub const NAME: &str = "DHT Token";
pub const SYMBOL: &str = "DHT";
pub const DECIMALS: u8 = 8;

// ICRC-1 Standard Functions

#[ic_cdk::update]
pub fn transfer(arg: TransferArg) -> Result<BlockIndex, TransactionError> {
    LEDGER.with(|ledger| ledger.borrow_mut().transfer(arg))
}

#[ic_cdk::query]
pub fn balance_of(args: AccountBalanceArgs) -> u128 {
    LEDGER.with(|ledger| ledger.borrow().account_balance(args))
}

#[ic_cdk::query]
pub fn total_supply() -> u128 {
    LEDGER.with(|ledger| ledger.borrow().total_supply)
}

#[ic_cdk::query]
pub fn metadata() -> Vec<(String, MetadataValue)> {
    METADATA.with(|metadata| {
        if metadata.borrow().is_empty() {
            let mut data = vec![
                (
                    "icrc1:version".to_string(),
                    MetadataValue::Text("1.3.0".to_string()),
                ),
                (
                    "icrc1:name".to_string(),
                    MetadataValue::Text(NAME.to_string()),
                ),
                (
                    "icrc1:symbol".to_string(),
                    MetadataValue::Text(SYMBOL.to_string()),
                ),
                ("icrc1:decimals".to_string(), MetadataValue::Nat8(DECIMALS)),
                (
                    "icrc1:fee".to_string(),
                    MetadataValue::Nat(DEFAULT_TRANSFER_FEE),
                ),
            ];
            metadata.borrow_mut().clear();
            metadata.borrow_mut().append(&mut data);
        }
        metadata.borrow().clone()
    })
}

#[ic_cdk::init]
fn init() {
    // Mint initial supply to caller
    let caller = ic_cdk::caller();
    let initial_account = (caller, 0);

    LEDGER.with(|ledger| {
        ledger
            .borrow_mut()
            .mint(initial_account, 100_000_000 * 10u128.pow(DECIMALS as u32));
    });

    // Set metadata
    METADATA.with(|metadata| {
        metadata.borrow_mut().clear();
    });
}

#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    // Save state before upgrade
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    // Restore state after upgrade
}

// Export Candid interface
ic_cdk::export_candid!();
