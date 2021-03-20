import React, { useMemo, useState } from "react";
import { Card, Col, Row, List } from "antd";
import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import Account from "../Account";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";
import { Address, Balance } from "../";
const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run chain
      </span>{" "}
      and{" "}
      <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function Contract({ customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer ,mainnetProvider,AddEventEvent}) {

  const contracts = useContractLoader(provider);
  let contract
  if(!customContract){
    contract = contracts ? contracts[name] : "";
  }else{
    contract = customContract
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );

  const [refreshRequired, triggerRefresh] = useState(false)
  const contractDisplay = displayedContractFunctions.map(fn => {
    if (isQueryable(fn)) {
      // If there are no inputs, just display return value
      return <DisplayVariable key={fn.name} contractFunction={contract[fn.name]} functionInfo={fn} refreshRequired={refreshRequired} triggerRefresh={triggerRefresh}/>;
    }
    // If there are inputs, display a form to allow users to provide these
    return (
      <FunctionForm
        key={"FF" + fn.name}
        contractFunction={(fn.stateMutability === "view" || fn.stateMutability === "pure")?contract[fn.name]:contract.connect(signer)[fn.name]}
        functionInfo={fn}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
    );
  });

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Row gutter={16}>
        <Col span={6} style={{ marginTop: 25, width: "100%" }}>
          <Card>
            Logs
            <List
              bordered
              dataSource={AddEventEvent}
              renderItem={item => {
                console.log("Itemm", item);
                return (
                  <List.Item key={item.blockNumber + "_" + item.sender + "_" + item[1]._hex}>
                    <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =>
                    {item[1]._hex}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card
            title={
              <div>
                {name}
                <div style={{ float: "right" }}>
                  <Account
                    address={address}
                    localProvider={provider}
                    injectedProvider={provider}
                    mainnetProvider={provider}
                    price={price}
                    blockExplorer={blockExplorer}
                  />
                  {account}
                </div>
              </div>
            }
            size="large"
            style={{ marginTop: 25, width: "100%" }}
            loading={contractDisplay && contractDisplay.length <= 0}
          >
            {contractIsDeployed ? contractDisplay : noContractDisplay}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
