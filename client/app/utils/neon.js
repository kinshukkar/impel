/* eslint-disable prefer-destructuring */

import Neon, { sc, wallet, rpc } from '@cityofzion/neon-js';

console.log('Neon---', Neon);

const config = {
  networkMagic: 844378958,
  impelScriptHash: '9749d32f230493afa5c0e86851f9e13f68cf21f8',
  impelTokenScriptHash: '13b56017d9f177c2020821afad231d211b20790d',
  rpcAddress: 'http://seed2t.neo.org:20332',
  walletWif: 'KxxedRx1rJ9dZ4ptfXgYVSsLjkPud3ZxgZzdkbN1JGVk6MdbM7F8',
  account: new wallet.Account('KxxedRx1rJ9dZ4ptfXgYVSsLjkPud3ZxgZzdkbN1JGVk6MdbM7F8'),
  rpcClient: new rpc.RPCClient('http://seed2t.neo.org:20332'),
};

async function createTransaction(account, contract, operation, params) {
  const script = sc.createScript({
    scriptHash: contract,
    operation,
    args: params,
  });

  const systemFee = 0;
  const networkFee = 0;
  const currentHeight = await config.rpcClient.getBlockCount();

  const transaction = new Neon.tx.Transaction({
    signers: [
      {
        account: account.scriptHash,
        scopes: Neon.tx.WitnessScope.CalledByEntry,
      },
    ],
    validUntilBlock: currentHeight + 1000,
    script,
    systemFee,
    networkFee,
  });

  // Network Fee Block begins
  const feePerByteInvokeResponse = await config.rpcClient.invokeFunction(
    Neon.CONST.NATIVE_CONTRACT_HASH.PolicyContract,
    'getFeePerByte',
  );

  if (feePerByteInvokeResponse.state !== 'HALT') {
    if (networkFee === 0) {
      throw new Error('Unable to retrieve data to calculate network fee.');
    } else {
      console.log(
        '\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m',
      );
      transaction.networkFee = Neon.u.BigInteger.fromNumber(networkFee);
    }
  }

  const feePerByte = Neon.u.BigInteger.fromNumber(feePerByteInvokeResponse.stack[0].value);
  const transactionByteSize = transaction.serialize().length / 2 + 109;
  const witnessProcessingFee = Neon.u.BigInteger.fromNumber(1000390);
  const networkFeeEstimate = feePerByte.mul(transactionByteSize).add(witnessProcessingFee);
  if (networkFee && networkFee >= networkFeeEstimate.toNumber()) {
    transaction.networkFee = Neon.u.BigInteger.fromNumber(networkFee);
    console.log(`  i Node indicates ${networkFeeEstimate.toDecimal(8)} networkFee but using user provided value of ${networkFee}`);
  } else {
    transaction.networkFee = networkFeeEstimate;
  }
  console.log(
    `\u001b[32m  ✓ Network Fee set: ${transaction.networkFee.toDecimal(8)} \u001b[0m`,
  );
  // Network Fee Block ends

  // System Fee Block starts
  const invokeFunctionResponse = await config.rpcClient.invokeScript(Neon.u.HexString.fromHex(transaction.script), [
    {
      account: account.scriptHash,
      scopes: Neon.tx.WitnessScope.CalledByEntry,
    },
  ]);
  if (invokeFunctionResponse.state !== 'HALT') {
    throw new Error(
      `Transfer script errored out: ${invokeFunctionResponse.exception}`,
    );
  }
  const requiredSystemFee = Neon.u.BigInteger.fromNumber(invokeFunctionResponse.gasconsumed);
  if (systemFee && systemFee >= requiredSystemFee) {
    transaction.systemFee = Neon.u.BigInteger.fromNumber(systemFee);
    console.log(
      `  i Node indicates ${requiredSystemFee} systemFee but using user provided value of ${systemFee}`,
    );
  } else {
    transaction.systemFee = requiredSystemFee;
  }
  console.log(
    `\u001b[32m  ✓ SystemFee set: ${transaction.systemFee.toDecimal(8)}\u001b[0m`,
  );
  // System Fee Block ends

  const signedTransaction = transaction.sign(account, config.networkMagic);
  console.log(transaction.toJson());

  const result = await config.rpcClient.sendRawTransaction(Neon.u.HexString.fromHex(signedTransaction.serialize(true)));

  return result;
}

const createUser = (userAddress, username) => {
  return createTransaction(config.account, config.impelScriptHash, 'registerUser', [
    sc.ContractParam.string(userAddress),
    sc.ContractParam.string(username),
  ]);
};

const addChallenge = () => {
  return createTransaction(config.account, config.impelScriptHash, 'addChallenge', [
    Neon.sc.ContractParam.string('July 10K Challenge'),
    Neon.sc.ContractParam.integer(1625097600000),
    Neon.sc.ContractParam.integer(1627689600000),
    Neon.sc.ContractParam.integer(1628985600000),
    Neon.sc.ContractParam.integer(0), // ChallengeActivityTypeWalkRun
    Neon.sc.ContractParam.integer(0), // ChallengeTypeMax
    Neon.sc.ContractParam.integer(10000),
  ]);
};

function format_datetime(s) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'medium',
    timeZone: 'UTC',
    dateStyle: 'medium',
  });

  return dtFormat.format(new Date(s));
}

// console.log(await getUser("NfibB9s6UNQc7n7UK1C4zHiiVKuYJ3QBgc"));
// console.log(await getUser("NZUPUkpWvxTacv9p7hqBtpCuxHAHfGrnyU"));
export async function getUser(address) {
  console.log('address--', address);
  console.log('str--', `B*${address}`);
  console.log('hexstring--', Neon.u.str2hexstring(`B*${address}`));
  const result = await config.rpcClient.getStorage(
			  config.impelScriptHash,
			  Neon.u.str2hexstring(`B*${address}`),
  );
  console.log('getUser result--', result);

  return JSON.parse(Neon.u.base642utf8(result))[0];
}

async function getChallenges(active) {
  let func = '';
  if (active) {
    func = 'getActiveChallenges';
  } else {
    func = 'getAllChallenges';
  }

  const result = await config.rpcClient.invokeFunction(
				  config.impelScriptHash,
				  func,
  );

  const allChallengeElements = result.stack[0].value;
  const challenges = [];
  for (let i = allChallengeElements.length - 1; i >= 0; i - 1) {
    const elements = allChallengeElements[i].value;
    const challenge = {};
    challenge.id = elements[0].value;
    challenge.title = Neon.u.base642utf8(elements[1].value);
    challenge.startTime = format_datetime(Number(elements[2].value));
    challenge.endTime = format_datetime(Number(elements[3].value));
    challenge.evaluationTime = format_datetime(Number(elements[4].value));
    challenge.state = elements[5].value;
    challenge.activityType = elements[6].value;
    challenge.type = elements[7].value;
    challenge.value = elements[8].value;

    challenges.push(challenge);
  }

  return challenges;
}

// console.log(await getAllChallenges());
async function getActiveChallenges() {
  return getChallenges(true);
}

async function getAllChallenges() {
  return getChallenges(false);
}

function parse_challenge(elements) {
  const challenge = {};
  challenge.id = elements[0];
  challenge.title = elements[1];
  challenge.startTime = format_datetime(elements[2]);
  challenge.endTime = format_datetime(elements[3]);
  challenge.evaluationTime = format_datetime(elements[4]);
  challenge.state = elements[5];
  challenge.activityType = elements[6];
  challenge.type = elements[7];
  challenge.value = elements[8];

  return challenge;
}

// console.log(await getChallengeDetails(1));
// console.log(await getChallengeDetails(2));
async function getChallengeDetails(challengeId) {
  const result = await config.rpcClient.getStorage(
			  config.impelScriptHash,
			  Neon.u.str2hexstring('C*') + Neon.u.int2hex(challengeId),
  );

  const elements = JSON.parse(Neon.u.base642utf8(result));

  return parse_challenge(elements);
}
