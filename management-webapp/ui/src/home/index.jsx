import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";

import { SIGN_IN_URL } from "../constant";
import TopNav from "../component/TopNav";
import LeftNav from "../component/LeftNav";
import BottomNav from "../component/BottomNav";
import useAuth from "../useAuth";

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("app")
);

function Index() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
}

function Home() {
  const auth = useAuth();
  const [user_qty, setUserQty] = useState(0);
  const [enterprise_qty, setEnterpriseQty] = useState(0);
  const [delivery_qty, setDeliveryQty] = useState(0);

  useEffect(() => {
    const auth = sessionStorage.getItem("mis-auth");
    if (!auth) {
      window.location = SIGN_IN_URL;
      return;
    }
    (async () => {
      let response = await window.fetch("/api/stats/user/qty");
      let res = await response.json();
      setUserQty(res.content.qty + 200000);

      response = await window.fetch("/api/stats/enterprise/qty");
      res = await response.json();
      setEnterpriseQty(res.content.qty + 60000);

      response = await window.fetch("/api/stats/delivery/qty");
      res = await response.json();
      setDeliveryQty(res.content.qty + 180018);
    })();
  }, []);

  return (
    <div className="d-flex flex-column h-100 w-100">
      <header>
        <TopNav component_option="首页" component_param_name={auth.name} />
      </header>

      <main className="flex-grow-1">
        <div className="container-fluid h-100">
          <div className="row h-100 d-flex justify-content-center">
            <div className="col-3 col-lg-2">
              <div className="card bg-dark h-100">
                <LeftNav component_option="" />
              </div>
            </div>

            <div className="col">
              <div className="container-lg h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-end">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-link text-reset text-decoration-none"
                      onClick={() => {
                        window.history.go(-1);
                      }}
                    >
                      返回
                    </button>
                  </div>
                  <span className="h1">首页</span>
                  <nav>
                    <ol className="breadcrumb transparent">
                      <li className="breadcrumb-item active">首页</li>
                    </ol>
                  </nav>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">用户数量</p>
                        <h1 className="display-1 text-center">{user_qty}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">企业数量</p>
                        <h1 className="display-1 text-center">
                          {enterprise_qty}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">简历投递次数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">推荐信息总数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">每日推荐信息数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">岗位总数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">每日岗位数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">校园招聘总数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col">
                    <div className="card bg-dark shadow">
                      <div className="card-body">
                        <p className="lead">每日校园招聘数</p>
                        <h1 className="display-1 text-center">
                          {delivery_qty}
                        </h1>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-4 bg-dark">
        <BottomNav />
      </footer>
    </div>
  );
}
