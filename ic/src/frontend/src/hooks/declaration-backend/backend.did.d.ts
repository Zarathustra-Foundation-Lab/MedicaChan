import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface HealthCheckup {
  'id' : string,
  'is_public' : boolean,
  'data' : HealthData,
  'date' : bigint,
}
export interface HealthData {
  'photo_url' : [] | [string],
  'sleep_hours' : [] | [number],
  'blood_pressure' : string,
  'temperature' : number,
  'mood' : string,
  'note' : string,
  'activity_level' : [] | [string],
  'respiration_rate' : [] | [number],
  'heart_rate' : number,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'certificate_version' : [] | [number],
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'upgrade' : [] | [boolean],
  'status_code' : number,
}
export interface HttpUpdateResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export type Result = { 'Ok' : HealthCheckup } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<HealthCheckup> } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : string };
export interface User {
  'id' : Principal,
  'age' : number,
  'chronic_diseases' : [] | [string],
  'weight_kg' : [] | [number],
  'total_rewards' : bigint,
  'gender' : string,
  'health_data' : Array<HealthCheckup>,
  'height_cm' : [] | [number],
  'allergies' : [] | [string],
  'full_name' : string,
}
export interface _SERVICE {
  'add_checkup' : ActorMethod<[Principal, HealthData], Result>,
  'get_private_data' : ActorMethod<[Principal], Result_1>,
  'get_public_data' : ActorMethod<[], Array<HealthCheckup>>,
  'get_user_history' : ActorMethod<[Principal], Result_1>,
  'get_user_profile' : ActorMethod<[Principal], Result_2>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'http_request_update' : ActorMethod<[HttpRequest], HttpUpdateResponse>,
  'publish_checkup' : ActorMethod<[Principal, string], Result_3>,
  'register_user' : ActorMethod<
    [
      Principal,
      string,
      number,
      string,
      [] | [number],
      [] | [number],
      [] | [string],
      [] | [string],
    ],
    Result_2
  >,
  'reward_user' : ActorMethod<[Principal, bigint], Result_2>,
  'update_profile_user' : ActorMethod<
    [
      Principal,
      string,
      number,
      string,
      [] | [number],
      [] | [number],
      [] | [string],
      [] | [string],
    ],
    Result_2
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
