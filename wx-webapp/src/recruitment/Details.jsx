import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ToBack from '../components/ToBack';
import { _EditJournal, FavoriteJournal, _BrowseJournal } from '../commonFetch';

export const searchFavorite = (body) =>
  new Promise((resolve, reject) => {
    fetch('./api/favorite/search/one/', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });

const Details = () => {
  const [data, setData] = useState(0);

  const [favorite, setFavorite] = useState(0);

  const [delivery, setDelivery] = useState(0);

  const [auth, setAuth] = useState(0);

  const { id } = useParams();

  const { search } = useLocation();

  useEffect(() => {
    fetch(`./api/recruitment/${id}${search}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.content) {
          setData(res.content);
        } else {
          alert(res.message);
        }
      });
  }, [id, search]);

  useEffect(() => {
    if (data) {
      const _auth = JSON.parse(localStorage.getItem('auth'));
      document.getElementById('description').innerHTML = data.description;
      document.getElementById('requirement').innerHTML = data.requirement;
      if (_auth !== null) {
        setAuth(() => _auth);
        _BrowseJournal(
          {
            data_id: data.id,
            data_uuid: data.uuid,
            category: '岗位',
          },
          () => {},
        );
        searchFavorite({
          user_id: _auth.id,
          data_id: data.id,
          category1: '个人用户',
          category2: '岗位',
        }).then((res) => {
          if (res.content) {
            setFavorite(() => res.content);
          }
        });
        fetch(`./api/delivery/${_auth.id}/${data.id}/`)
          .then((res) => res.json())
          .then((res) => {
            if (res.content) {
              setDelivery(() => res.content);
            }
          });
      }
    }
  }, [data]);

  const handleFavorite = () => {
    const _auth = JSON.parse(localStorage.getItem('auth'));
    if (_auth === null) {
      window.location = '#登录';
    } else if (favorite) {
      fetch(`./api/favorite/${favorite.id}/`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === '') {
            setFavorite(false);
          } else {
            alert(res.message);
          }
        });
    } else {
      FavoriteJournal(
        {
          data_id: data.id,
          data_uuid: data.uuid,
          category2: '岗位',
        },
        (res) => {
          if (res.message === '') {
            searchFavorite({
              user_id: auth.id,
              data_id: data.id,
              category1: '个人用户',
              category2: '岗位',
            }).then((res1) => {
              if (res1.content) {
                setFavorite(res1.content);
              }
            });
          } else {
            alert(res.message);
          }
        },
      );
    }
  };

  const handleResumeDelivery = () => {
    const _auth = JSON.parse(localStorage.getItem('auth'));
    if (_auth === null) {
      window.location = '#登录';
    } else {
      fetch(`./api/delivery/?uuid=${auth.uuid}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          common_user_id: auth.id,
          recruitment_id: data.id,
          recruitment_uuid: data.uuid,
          datime: moment().format('YYYY-MM-DD HH:mm'),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === '') {
            fetch(`./api/delivery/${auth.id}/${data.id}/`)
              .then((res1) => res1.json())
              .then((res1) => {
                if (res1.content) {
                  _EditJournal(
                    {
                      category2: '岗位',
                      data_id: data.id,
                      data_uuid: data.uuid,
                      remark: `将简历到岗位<${data.name}>`,
                    },
                    () => {},
                  );
                  setDelivery(res1.content);
                }
              });
          } else {
            alert(res.message);
          }
        });
    }
  };

  const getButton = () => {
    let button;
    if (delivery) {
      button = (
        <div className="col-5 nav-col">
          <button type="button" className="btn btn-secondary nav-btn" disabled>
            {delivery.status}
          </button>
        </div>
      );
    } else {
      button = (
        <div className="col-5 nav-col">
          <button type="button" className="btn btn-primary nav-btn" onClick={handleResumeDelivery}>
            投递简历
          </button>
        </div>
      );
    }
    return button;
  };

  return (
    <>
      <div className="container-fluid" style={{ fontSize: 14 }}>
        <div className="card border-0 shadow mt-2 ">
          <ToBack report advisory dataType="岗位" dataId={id} search={search} />
          <div className="card-body">
            {data && (
              <>
                <div className="row mt-3">
                  <div className="col">
                    <h4>{data.name}</h4>
                  </div>
                  <div className="col-4">
                    <span className="pull-right text-muted" style={{ fontSize: 14 }}>
                      {data.date}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span className="text-muted" style={{ fontSize: 14 }}>
                      {data.address2 ? data.address2 : data.address1} |{data.education}|
                      {data.category}
                    </span>
                  </div>
                </div>
                <div className="row ">
                  <div className="col">
                    <h5 className="text-success">
                      {data.salary1 && data.salary2 ? `${data.salary1}-${data.salary2}/月` : '面议'}
                    </h5>
                  </div>
                </div>
                <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
                <div className="row mt-3">
                  <div className="col">
                    <a
                      className="pull-left"
                      href={`#岗位/企业/${data.enterprise_id}?u_id=${data.enterprise_uuid}`}
                    >
                      <h6>{data.enterprise_name}</h6>
                    </a>
                    <div className="pull-right">
                      <a
                        className="text-success"
                        href={`#消息/${data.enterprise_name}/${data.ent_user_id}`}
                      >
                        咨询
                      </a>
                    </div>
                  </div>
                </div>
                <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
                <div className="row mt-3">
                  <div className="col">
                    <h5>职位描述</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    岗位要求:
                    <br />
                    <div id="requirement" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    工作内容:
                    <br />
                    <div id="description" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="recommond-bottom" />
      <ul className="nav bg-light nav-light fixed-bottom nav-bottom border-top">
        <div className="row text-center nav-row">
          <div className="col nav-col" />
          <div className="col nav-col" />
          <div className="col-3 nav-col">
            <button
              type="button"
              className="btn btn-light nav-btn text-muted"
              onClick={handleFavorite}
            >
              {favorite ? (
                <FontAwesomeIcon icon={faStar} style={{ color: '#FFFF00' }} fixedWidth />
              ) : (
                <FontAwesomeIcon icon={faStar} fixedWidth />
              )}
              收藏
            </button>
          </div>
          {data.status === '停招' ? (
            <div className="col-5 nav-col">
              <button type="button" className="btn btn-secondary nav-btn" disabled>
                已停招
              </button>
            </div>
          ) : (
            getButton()
          )}
        </div>
      </ul>
    </>
  );
};

export default Details;
