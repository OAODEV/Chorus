const Var = artifacts.require("./Var.sol")

async function assertReverts(f, message) {
  try {
    await f()
  } catch (e) {
    assert.equal(
      e.message,
      `VM Exception while processing transaction: revert ${message}`
    )
  }
}

contract("Var", ([alice, bob, carol, vick, ...accounts]) => {

  let varContract
  beforeEach(async () => {
    varContract = await Var.new()
  })

  it("creates sets and gets vars namespaced by account", async () => {
    const varName = "firstName"
    // valueNames should be things like keys to hash tables, or IPFS paths
    const alicesValName = "a123abc"
    const bobsValName = "b123abc"

    await varContract.newVar(varName, alicesValName, {from: alice})
    await varContract.newVar(varName, bobsValName, {from: bob})

    assert.equal(await varContract.get(varName, {from: alice}), alicesValName)
    assert.equal(await varContract.get(varName, {from: bob}), bobsValName)

    const alicesNewValName = "a789xyz"
    const bobsNewValName = "b789xyz"

    await varContract.set(varName, alicesNewValName, {from: alice})
    await varContract.set(varName, bobsNewValName, {from: bob})

    assert.equal(
      await varContract.get(varName, {from: alice}),
      alicesNewValName
    )
    assert.equal(await varContract.get(varName, {from: bob}), bobsNewValName)
  })

  it("Cannot set or get undeclared vars", async () => {
    assertReverts(
      async () => { await varContract.get("a", {from: alice}) },
      "Cannot get undeclared var"
    )
    assertReverts(
      async () => { await varContract.set("a", "a", {from: alice}) },
      "Cannot set undeclared var"
    )
  })

  it("Cannot declare a var name that has already been declared", async () => {
    const varName = "varName"
    await varContract.newVar(varName, "0x...")
    await assertReverts(
      async () => { await varContract.newVar(varName, "0x123") },
      "Var name has already been declared"
    )
  })
})
