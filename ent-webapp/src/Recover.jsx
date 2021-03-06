import React, { useEffect, useState } from 'react';

import md5 from 'blueimp-md5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

const Recover = () => {
  const [data, setData] = useState({
    code: '',
    email: '',
    password1: '',
    password2: '',
  });

  const [count, setCount] = useState({
    countdown: 60,
    flag: true,
  });

  const [err, setErr] = useState({
    code: '',
    email: '',
    password1: '',
    password2: '',
  });

  useEffect(() => {
    sessionStorage.removeItem('auth');
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSigin = async () => {
    const errData = {};

    Object.getOwnPropertyNames(data).forEach((key) => {
      if (data[key].trim() === '') {
        errData[key] = '请填写内容';
      }
    });

    if (Object.getOwnPropertyNames(errData).length !== 0) {
      setErr(errData);
      window.console.info(errData);
      return;
    }

    if (data.password1 !== data.password2) {
      setErr(() => ({
        password1: '请确认密码',
        password2: '请确认密码',
      }));

      return;
    }

    const response = await fetch('/api/ent-user/recover/', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        password: md5(data.password1),
        code: data.code,
        email: data.email,
        user_category: '企业用户',
      }),
    });
    const res = await response.json();
    if (res.message) {
      let alertFlg = false;
      if (typeof res.message === 'object') {
        Object.getOwnPropertyNames(res.message).forEach((key) => {
          switch (key) {
            case 'code':
              errData[key] = '验证码错误';
              break;
            default:
              alertFlg = true;
          }
        });
      } else {
        alertFlg = true;
      }
      if (alertFlg) {
        window.alert(res.message);
      }
      setErr(errData);
    } else {
      window.alert('操作成功');
      window.location = '#登录';
    }
  };

  const handleCode = () => {
    const reg = /^[a-zA-Z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (reg.test(data.email) === false) {
      window.alert('请检查邮箱格式是否输入正确');
      return;
    }
    fetch('./api/ent-user/checkRecover/', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          window.alert(res.message);
        } else {
          fetch('./api/email/', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              code: data.code,
              user_category: '企业用户',
            }),
          })
            .then((res1) => res1.json())
            .then((res1) => {
              if (res1.message) {
                window.alert(res1.message);
              } else {
                window.alert('验证码已发送到公司邮箱');
              }
            });
        }
      });
    const code = setInterval(() => {
      if (count.countdown === 1) {
        clearInterval(code);
        setCount({
          flag: true,
          countdown: 60,
        });
      } else {
        setCount({
          flag: false,
          countdown: (count.countdown -= 1),
        });
      }
    }, 1000);
  };

  const checkEmail = () => {
    if (data.email === '') {
      return true;
    }
  };

  return (
    <div className="container-fluid bg-white body-login">
      <div className="row px-5 fixed-top bg-white border-bottom body-title">
        <div className="col-9 item-middle">
          <img className="img-fluid pull-left logo2" alt="" src="./lib/img/logo3.png" />
        </div>
        <div className="col-1 header-right">
          <a
            className="text-warning pull-right"
            href="#登录"
            style={{ fontSize: '16px', textDecoration: 'none' }}
          >
            我要登录
          </a>
        </div>
        <div className="col-2 header-right pull-left">
          <span className="text-secondary border-0 bg-transparent img-weixin">
            <FontAwesomeIcon icon={faQrcode} fixedWidth />
            小程序
            <p>
              <img className="" alt="" src="./lib/img/qrcode.jpg" />
            </p>
          </span>
        </div>
      </div>

      <div
        className="row px-5 "
        style={{
          height: '70%',
          minHeight: '459px',
          marginTop: 100,
        }}
      >
        <div className="col mt-1">
          <div className="card col-6 offset-3 col-lg-4 offset-lg-4 border-0">
            <div className="card-body">
              <div className="row">
                <div className="col text-center">
                  <h3>忘记密码</h3>
                </div>
              </div>
              <form>
                <div className="form-group">
                  <label>企业邮箱</label>
                  <input
                    className="form-control rounded-0"
                    type="email"
                    placeholder="企业邮箱"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                  />
                  {err.email && <small className="form-text text-danger">{err.phone}</small>}
                </div>

                <div className="form-group">
                  <label>验证码</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      value={data.code || ''}
                      name="code"
                      placeholder="验证码"
                      onChange={handleChange}
                      className="form-control rounded-0"
                    />
                    <div className="input-group-append">
                      {count.flag ? (
                        <button
                          className="btn btn-primary rounded-0"
                          type="button"
                          onClick={handleCode}
                          disabled={checkEmail()}
                        >
                          发送验证码
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary rounded-0"
                          type="button"
                          disabled="disabled"
                        >
                          已发送{count.countdown}s
                        </button>
                      )}
                    </div>
                  </div>
                  {err.code && <small className="form-text text-danger">{err.code}</small>}
                </div>

                <div className="form-group">
                  <label>新密码</label>
                  <input
                    className="form-control rounded-0"
                    type="password"
                    placeholder="密码"
                    name="password1"
                    autoComplete="off"
                    value={data.password1}
                    onChange={handleChange}
                  />
                  {err.password1 && (
                    <small className="form-text text-danger">{err.password1}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>确认密码</label>
                  <input
                    className="form-control rounded-0"
                    type="password"
                    placeholder="确认密码"
                    name="password2"
                    autoComplete="off"
                    value={data.password2}
                    onChange={handleChange}
                  />
                  {err.password2 && (
                    <small className="form-text text-danger">{err.password2}</small>
                  )}
                </div>
              </form>
              <div className="row mt-3 px-4 ">
                <div className="col">
                  <button
                    type="button"
                    className="mt-2 btn btn-login rounded-0"
                    onClick={handleSigin}
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row footer px-5  text-secondary"
        style={{
          height: '15%',
          minHeight: 99,
        }}
      />
    </div>
  );
};

export default Recover;
