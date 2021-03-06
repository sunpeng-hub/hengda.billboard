import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { DateTitle } from './Components';

const RecruitRow = ({
  title,
  id,
  uuid,
  address_level2,
  address_level3,
  time,
  school,
  category,
}) => (
  <>
    <div className="card border-0 p-3 user-radius mb-2 mt-2">
      <div className="row">
        <div className="col">
          <div className="pull-left">
            <strong>{title}</strong>
          </div>
          <div className="pull-right">
            <a href={`#/校园招聘/${id}?u_id=${uuid}`}>
              详情
              <FontAwesomeIcon icon={faAngleRight} fixedWidth size="lg" />
            </a>
          </div>
          <br />
          <span className="text-muted" style={{ fontSize: 11 }}>
            举办地点:
            {`${address_level2}-${address_level3}`}
            <br />
            开始时间:{time}
          </span>
          <br />
          <span>
            {school}({category})
          </span>
        </div>
      </div>
    </div>
  </>
);

RecruitRow.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  address_level2: PropTypes.string.isRequired,
  address_level3: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

const Schedule = () => {
  const [list, setList] = useState({});

  const [auth, setAuth] = useState(0);

  useEffect(() => {
    const _auth = JSON.parse(localStorage.getItem('auth'));
    if (_auth !== null) {
      setAuth(_auth);
      fetch(`./api/common-user-schedule/user/${_auth.id}/`)
        .then((res) => res.json())
        .then((res) => {
          if (res.message) {
            window.alert(res.message);
          } else {
            const data = {};
            const today = moment().format('YYYY-MM-DD');
            res.content.forEach((item) => {
              let { date } = item;
              if (today === date) {
                date = '今天';
              }
              if (data[date]) {
                data[date].push(item);
              } else {
                data[date] = [item];
              }
            });
            setList(data);
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
            <h6>登录后可以查看日程</h6>
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
          <div className="tab-content mt-1">
            <div className="tab-pane fade show active">
              {list.length === 0 ? (
                <div className="chat-login">
                  <h6>您近期还没有新的日程</h6>
                </div>
              ) : (
                <div>
                  {Object.getOwnPropertyNames(list).map((key) => (
                    <React.Fragment key={key}>
                      <DateTitle text={key} />
                      <div className="mt-2" />
                      {list[key].map((item) => (
                        <RecruitRow key={item.id} {...item} />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Navbar category="我的" />
    </>
  );
};

export default Schedule;
