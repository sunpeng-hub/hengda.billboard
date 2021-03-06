import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';

const DataRow = ({
  name,
  status,
  uuid,
  id,
  salary1,
  salary2,
  education,
  qty,
  datime,
  address2,
  address1,
}) => (
  <>
    <div className="card border-0 p-3 mb-2 mt-2 shadow">
      <div className="row">
        <div className="col">
          <div className="pull-left">
            <strong>{name}</strong>({status})
          </div>
          <div className="pull-right">
            <a
              style={{ fontSize: 14 }}
              className="badge badge-pill badge-info"
              href={`#/岗位/${id}?u_id=${uuid}`}
            >
              详情
            </a>
          </div>
          <br />
          <span className="text-success">
            {salary1 && salary2 ? `${salary1}-${salary2}` : '面议'}
          </span>
          <br />
          <span className="pull-left text-muted" style={{ fontSize: 11 }}>
            {address2 || address1}/{education} | 招聘人数:
            {qty}
          </span>
          <span className="pull-right text-muted text-small" style={{ fontSize: 11 }}>
            投递于: {datime}
          </span>
        </div>
      </div>
    </div>
  </>
);

DataRow.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  salary1: PropTypes.number.isRequired,
  salary2: PropTypes.number.isRequired,
  education: PropTypes.string.isRequired,
  qty: PropTypes.string.isRequired,
  datime: PropTypes.string.isRequired,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
};

const Delivery = () => {
  const [list, setList] = useState([]);
  const [auth, setAuth] = useState(0);

  useEffect(() => {
    const _auth = JSON.parse(localStorage.getItem('auth'));
    if (_auth !== null) {
      setAuth(_auth);
      fetch(`./api/delivery/user/${_auth.id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.message) {
            window.alert(res.message);
          } else {
            setList(res.content);
          }
        });
    }
  }, []);

  const handleLogIn = async () => {
    window.location = '#/登录';
  };

  return (
    <>
      {auth === 0 ? (
        <div className="container-fluid">
          <div className="chat-login">
            <h6>登录后可以查看投递情况</h6>
            <button
              type="button"
              style={{ width: '25%' }}
              className="btn btn-block mx-auto rounded-pill button-background text-white font-weight"
              onClick={handleLogIn}
            >
              登&nbsp;录
            </button>
          </div>
        </div>
      ) : (
        <div className="container-fluid" style={{ fontSize: 14 }}>
          {list.length === 0 ? (
            <div className="chat-login">
              <h6>您还没有投递简历</h6>
            </div>
          ) : (
            <div>
              <div className="mt-1" />
              {list && list.map((item) => <DataRow key={item.id} {...item} />)}
            </div>
          )}
        </div>
      )}
      <Navbar category="我的" />
    </>
  );
};

export default Delivery;
