const Wallet = artifacts.require('Wallet');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract('Wallet', (accounts) => {
    let wallet; //assign integer
    beforeEach(async () => { //before each block, async... must use await with async
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2); //specify 3 wallets, and 2 quorum (signers req)
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000}); // use web3 to send in wei
    });
//test for adding the approvers and the quorum
    it('should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });
// create a transfer test
    it('should create transfer', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
        const transfers = await wallet.getTransfers();
        assert(transfers.length == 1);
        assert(transfers[0].id === '0');
        assert(transfers[0].amount === '100');
        assert(transfers[0].to === accounts[5]);
        assert(transfers[0].approvals === '0');
        assert(transfers[0].sent === false);
    });
// test to verify it wont let a non approver create a transaction
    it('Unhappypath should not create if not approved', async () => {
        await expectRevert(
            wallet.createTransfer(100, accounts[5], {from: accounts[4]}),
        'only approver allowed'
        );
    });
// test to check approvals increment works. and you can approve from another approval act.
    it('should increment approvals', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
        await wallet.approveTransfer(0, {from:accounts[0]});
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        assert(transfers[0].approvals === '1');
        assert(transfers[0].sent === false);
        assert(balance === '1000');
    });
// check that quorum has been reached and send in test. 
 /*   it('should send if quorum reached', async() => {
        const balanceBefore = await web3.eth.getBalance(account[6]);
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        const balanceAfter = await web3.eth.getBalance(accounts[6]);
        assert(parseINt(balanceAfter) - parseInt(balanceBefore) === 10^18100); //Note: numbers too big use BN.js Library

    });
    */

    it('should send transfer if quorum reached', async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 100);

    });

    // unhappy path approver test - cant approve twice, already sent, not approver ect. 

    it('should NOT(unhappy) approve transfer if sender not approved', async() => {
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[4]}),
        'only approver allowed'
        );
    });

    it('it should NOT approve transfer if transfer is already sent', async() => {
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[2]}),
            'Transfer has already been sent'
        );
    });

    it('should not transfer twice', async() => {
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[0]}),
            'cannot approve transfer twice'
        );
    });

});