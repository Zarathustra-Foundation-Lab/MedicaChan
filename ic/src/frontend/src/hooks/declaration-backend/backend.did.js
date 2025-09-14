export const idlFactory = ({ IDL }) => {
  const HealthData = IDL.Record({
    'photo_url' : IDL.Opt(IDL.Text),
    'sleep_hours' : IDL.Opt(IDL.Float32),
    'blood_pressure' : IDL.Text,
    'temperature' : IDL.Float32,
    'mood' : IDL.Text,
    'note' : IDL.Text,
    'activity_level' : IDL.Opt(IDL.Text),
    'respiration_rate' : IDL.Opt(IDL.Nat32),
    'heart_rate' : IDL.Nat32,
  });
  const HealthCheckup = IDL.Record({
    'id' : IDL.Text,
    'is_public' : IDL.Bool,
    'data' : HealthData,
    'date' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : HealthCheckup, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(HealthCheckup),
    'Err' : IDL.Text,
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'age' : IDL.Nat32,
    'chronic_diseases' : IDL.Opt(IDL.Text),
    'weight_kg' : IDL.Opt(IDL.Float32),
    'total_rewards' : IDL.Nat64,
    'gender' : IDL.Text,
    'health_data' : IDL.Vec(HealthCheckup),
    'height_cm' : IDL.Opt(IDL.Float32),
    'allergies' : IDL.Opt(IDL.Text),
    'full_name' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'certificate_version' : IDL.Opt(IDL.Nat16),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'upgrade' : IDL.Opt(IDL.Bool),
    'status_code' : IDL.Nat16,
  });
  const HttpUpdateResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'status_code' : IDL.Nat16,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  return IDL.Service({
    'add_checkup' : IDL.Func([IDL.Principal, HealthData], [Result], []),
    'get_private_data' : IDL.Func([IDL.Principal], [Result_1], ['query']),
    'get_public_data' : IDL.Func([], [IDL.Vec(HealthCheckup)], ['query']),
    'get_user_history' : IDL.Func([IDL.Principal], [Result_1], ['query']),
    'get_user_profile' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'http_request_update' : IDL.Func([HttpRequest], [HttpUpdateResponse], []),
    'publish_checkup' : IDL.Func([IDL.Principal, IDL.Text], [Result_3], []),
    'register_user' : IDL.Func(
        [
          IDL.Principal,
          IDL.Text,
          IDL.Nat32,
          IDL.Text,
          IDL.Opt(IDL.Float32),
          IDL.Opt(IDL.Float32),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result_2],
        [],
      ),
    'reward_user' : IDL.Func([IDL.Principal, IDL.Nat64], [Result_2], []),
    'update_profile_user' : IDL.Func(
        [
          IDL.Principal,
          IDL.Text,
          IDL.Nat32,
          IDL.Text,
          IDL.Opt(IDL.Float32),
          IDL.Opt(IDL.Float32),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result_2],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
