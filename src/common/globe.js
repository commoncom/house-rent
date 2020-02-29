const disAmount = 4;
const disAddr = "0x16c0b9cb893BA4392131df01e70F831A07d02687";
const privKey = "0xEAEC183C4BADF7D89DEEF365F668C5D1C4FD47ADDC835F75EA2B572DA2502953";
const regAddr = "0x5AcA28f9da9960145e81c11293F94ad115ca3218";
const regpri = "0x8C6817D77CFD962F6EAB191251B9720D3EB76221AE5A28379C9B3D03EC68EA8A";

// contract address
const tokenConAddr = "0xfed21ab2993faa0e0b2ab92752428d96370d4889";
const regConAddr = "0x51f807fb009c77b3ca57d363ba581444afa619e5";
const remarkConAddr = "0xb7fdf357abf21d7d6aa0e956c2a4ba38651025f9";
const authConAddr= "0x063dc23b5332063ab5f88c23d3fb8545eb01c576";
const houseConAddr = "0x8a84a496682adbe32131b4d49ce3a17cbbfe22b6";
const agreeConAddr = "0x09cd6647c7a97dc1a9e8afc0bf0a8309ebec91e9";

const promiseAmount = 50;
const houseState = {
	Release: 0,
	WaitRent: 1,
	Renting: 2,
	EndRent: 3,
	Cance: 4,
	BreakRent: 5,
	AlreadyBreak: 6,
	RejectBreak: 9 // 拒绝毁约
}

const agreeState = {
	WaitSign: 0, // 等待租户签约
	FinishSign: 1, // 合同签约完成
	Renting: 2, //合同已生效
	EndRent: 3, // 租赁到期
	Cance: 4, // 取消租赁
	BreakRent: 5,// 毁约审核中
	AlreadyBreak: 6,// 已毁约
	RejectBreak: 9 // 拒绝毁约
}

const commentState = {
   AlreadyRent: 0, // 租赁已完成
   AlreadyBreak: 1, // 已毁约
   LandlordRemark: 2, // 房东已评论
   LeaserRemark: 3, // 租客已评论
   CloseRemark: 4 // 评论关闭
}

module.exports = {
	disAmount,
	disAddr,
	privKey,
	regAddr,
	regpri,
	tokenConAddr,
	regConAddr,
	remarkConAddr,
	authConAddr,
	houseConAddr,
	agreeConAddr,
	promiseAmount,
	houseState,
	agreeState,
	commentState
}

