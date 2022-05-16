const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
    let wallet; //assign integer
    beforeEach(async () => { //before each block, async... must use await with async
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2); //specify 3 wallets, and 2 quorum (signers req)
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000}); // use web3 to send in wei
    });

    it('should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });

    it('should create transfer'), async () => {
        await wallet.createTransfer()
    }


});