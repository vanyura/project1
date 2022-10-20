const hre = require("hardhat");
const secp256k1 = require("secp256k1");

//БЕЗОПАСНЫЙ ПОИСК КРАСИВОГО АДРЕСА ТРЕТЬЕЙ СТОРОНОЙ

async function main() {

    var P1 = "0x66dB83bdefDf28CB53863B2Fd814b5b4E67b3A1142390422434236767651c853";
    var P2 = "0x509e0d4d6e60b8a1c065f4ccdf33eff313629a0c9a4610bc8c050bdbc24d6722";
    var Key1 = new hre.ethers.Wallet(P1);
    console.log("Key1", Key1.address);


    var Key2 = new hre.ethers.Wallet(P2);
    console.log("Key2", Key2.address);

    var p1 = BigInt(P1);
    var p2 = BigInt(P2);
    var a1 = BigInt(Key1.publicKey);
    //var a2 = BigInt(Key2.publicKey);
    //var M = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");

    console.log("p1    ", BigToHex(p1));
    console.log("a1    ", BigToHex(a1));
    
    //Tweak = p2 (перебор параметра p2 для поиска красивого адреса)
    console.log("p2    ", BigToHex(p2));


    //красивый адрес тут
    var a3=secp256k1.publicKeyTweakMul(BigToArr(a1,65), BigToArr(p2), false);
    console.log("a1+a2 ", ToHex(a3));

    //новый приватник с красивым адресом
    var p4=ArrToBig(secp256k1.privateKeyTweakMul(BigToArr(p1), BigToArr(p2)));
    var Key4 = new hre.ethers.Wallet(p4);
    var a4 = BigInt(Key4.publicKey);
    console.log("a4    ", BigToHex(a4,65));
    console.log("p4    ", BigToHex(p4));



}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});







function toBigEndian(bigNumber,count) {
    let result = new Uint8Array(count);
    let i = 0;
    while (bigNumber > 0) {
        result[count-1-i] = Number(bigNumber % 256n);
        bigNumber = bigNumber / 256n;
        i += 1;
    }
    return result;
}
function ToHex(uint8)
{
    return Buffer.from(uint8.buffer,uint8.byteOffset,uint8.byteLength).toString('hex');    
}
function BigToArr(Num,count)
{
    if(!count)
        count=32;
    return toBigEndian(Num,count);
}
function BigToHex(Num,count)
{
    if(!count)
        count=32;
    return ToHex(BigToArr(Num,count));
}
function ArrToBig(Arr)
{
    return BigInt("0x"+ToHex(Arr));
}
