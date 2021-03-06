import React, { useEffect, useState } from 'react';

// import Title from '../components/Title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faFileAlt,
  faClock,
  faStar,
  faCar,
  faChevronRight,
  faPaperPlane,
  faEnvelope,
  faComments,
  faSignOutAlt,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

const User = () => {
  const [auth, setAuth] = useState(0);

  const [schedule, setSchedule] = useState(0);

  const [offer, setOffer] = useState(0);

  const [sys, setSys] = useState(0);

  useEffect(() => {
    document.title = '我的';
    const _auth = JSON.parse(localStorage.getItem('auth'));
    if (_auth !== null) {
      setAuth(_auth);
      fetch(`./api/common-user-schedule/count/${_auth.id}`)
        .then((res) => res.json())
        .then((res) => {
          setSchedule(res.content);
        });

      fetch(`./api/offer/common/total/${_auth.id}`)
        .then((res) => res.json())
        .then((res) => {
          setOffer(res.content);
        });

      fetch(`./api/message/sys/total/个人用户/${_auth.id}`)
        .then((res) => res.json())
        .then((res) => {
          setSys(res.content);
        });
    }
  }, []);

  return (
    <>
      <div className="container-fluid background-login1">
        {/* <Title category="我的" /> */}
        <div className="row background-login2">
          {/* <div className="col-2">
            <img className="img-circle" style={{ height: 65 }} src="lib/img/u868.png" alt="" />
          </div> */}
          {auth === 0 ? (
            <div className="col pt-4 pb-4">
              <h6>
                <a href="#/登录" className="text-white">
                  未登录
                </a>
              </h6>
              <span className="text-white">你还没有创建简历,暂时无法投递</span>
            </div>
          ) : (
            <div className="col background-login2 pt-4 pb-4">
              <a href="#/我的/设置" className="text-white">
                <h6>{auth.name}</h6>
              </a>
              <span className="text-white">
                电话:
                {auth.phone}
              </span>
              <br />
              <span className="text-white">
                邮箱:
                {auth.email}
              </span>
            </div>
          )}
        </div>
        <div className="card user-radius overlap shadow">
          <div className="card-body">
            <div className="row pb-2 text-center" style={{ fontSize: 11 }}>
              <div className="col">
                <a href="#/我的/简历" className="text-muted">
                  <FontAwesomeIcon icon={faFile} fixedWidth size="3x" className="text-primary" />
                  <br />
                  我的简历
                </a>
              </div>
              <div className="col">
                <a href="#/我的/投递" className="text-muted">
                  <FontAwesomeIcon icon={faFileAlt} fixedWidth size="3x" className="text-primary" />
                  <br />
                  投递情况
                </a>
              </div>
              <div className="col">
                <a href="#/我的/记录/浏览" className="text-muted">
                  <FontAwesomeIcon icon={faClock} fixedWidth size="3x" className="text-primary" />
                  <br />
                  操作记录
                </a>
              </div>
              <div className="col">
                <a href="#/我的/收藏" className="text-muted">
                  <FontAwesomeIcon icon={faStar} fixedWidth size="3x" className="text-primary" />
                  <br />
                  我的收藏
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ height: 7, backgroundColor: 'rgb(245, 245, 245)' }} />
        {/* <div className="row p-2 mt-2" >
          <div className="col">
            <a className="text-dark" href="#/登录" >
              <h6 className="pull-left" >
                <strong>平台介绍</strong>
              </h6>
              <i className="fa fa-chevron-right fa-fw pull-right text-muted" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <hr style={{ marginTop: '0', marginBottom: '0' }} /> */}
        <div className="card user-radius shadow">
          <div className="row p-2 mt-2">
            <div className="col">
              <a className="text-dark" href="#/我的/日程">
                <span className="pull-left pl-2">
                  <FontAwesomeIcon icon={faCar} fixedWidth size="2x" className="text-info" />
                </span>
                <h6 className="pull-left pt-1">
                  <strong>&nbsp;日程</strong>
                </h6>
                <span className="pull-right text-muted pt-1">
                  {schedule === 0 ? '' : `今天有${schedule}个日程`}
                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </span>
              </a>
            </div>
          </div>
          <hr style={{ marginTop: '0', marginBottom: '0' }} />
          <div className="row p-2 mt-2">
            <div className="col">
              <a className="text-dark" href="#/我的/面试">
                <span className="pull-left pl-2">
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    fixedWidth
                    size="2x"
                    className="text-primary"
                  />
                </span>
                <h6 className="pull-left pt-1">
                  <strong>&nbsp;面试邀请</strong>
                </h6>
                <span className="pull-right text-muted pt-1">
                  {offer === 0 ? '' : `您有${offer}条面试邀请未查看`}
                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </span>
              </a>
            </div>
          </div>
          <hr style={{ marginTop: '0', marginBottom: '0' }} />
          <div className="row p-2 mt-2">
            <div className="col">
              <a className="text-dark" href="#/我的/系统消息">
                <span className="pull-left pl-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    fixedWidth
                    size="2x"
                    className="text-success"
                  />
                </span>
                <h6 className="pull-left pt-1">
                  <strong>&nbsp;系统消息</strong>
                </h6>
                <span className="pull-right text-muted pt-1">
                  {sys === 0 ? '' : `您有${sys}条系统消息未查看`}
                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </span>
              </a>
            </div>
          </div>
          <hr style={{ marginTop: '0', marginBottom: '0' }} />
          <div className="row p-2 mt-2">
            <div className="col">
              <a className="text-dark" href="#/我的/反馈">
                <span className="pull-left pl-2">
                  <FontAwesomeIcon
                    icon={faComments}
                    fixedWidth
                    size="2x"
                    className="text-warning"
                  />
                </span>
                <h6 className="pull-left pt-1">
                  <strong>&nbsp;反馈/投诉</strong>
                </h6>
                <span className="pull-right text-muted pt-1">
                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </span>
              </a>
            </div>
          </div>
          <hr style={{ marginTop: '0', marginBottom: '0' }} />
          <div className="row p-2 mt-2">
            <div className="col">
              <a className="text-dark" href="#/我的/修改密码">
                <span className="pull-left pl-2">
                  <FontAwesomeIcon icon={faEdit} fixedWidth size="2x" className="text-secondary" />
                </span>
                <h6 className="pull-left pt-1">
                  <strong>&nbsp;修改密码</strong>
                </h6>
                <span className="pull-right text-muted pt-1">
                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </span>
              </a>
            </div>
          </div>
          <hr style={{ marginTop: '0', marginBottom: '0' }} />
          {auth === 0 || (
            <>
              <div className="row p-2 mt-2">
                <div className="col">
                  <a className="text-dark" href="#/登录">
                    <span className="pull-left pl-2">
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        fixedWidth
                        size="2x"
                        className="text-danger"
                      />
                    </span>
                    <h6 className="pull-left text-danger pt-1">
                      <strong>&nbsp;注销</strong>
                    </h6>
                    <span className="pull-right text-muted pt-1">
                      <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                    </span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Navbar category="我的" />
    </>
  );
};

export default User;
