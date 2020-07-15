import React, { useEffect, useState } from 'react'

import ToBack from '../components/ToBack'
import { useParams, useLocation } from 'react-router-dom'
import { searchFavorite } from '../recruitment/Details'
import { _EditJournal, FavoriteJournal, _BrowseJournal } from '../commonFetch'


const Details = () => {

  const [item, setItem] = useState(0)

  const [favorite, setFavorite] = useState(false)

  const [auth, setAuth] = useState(0)

  const [schedule, setSchedule] = useState(false)

  const { id } = useParams()

  const { search } = useLocation()

  useEffect(() => {
    fetch(`./api/campus/${id}${search}`)
      .then(res => res.json())
      .then(res => {
        if (res.content) {
          setItem(res.content)
          _BrowseJournal({
            data_id: id,
            data_uuid: res.content.uuid,
            category: '校园招聘',
          }, res => { })
        } else {
          alert(res.message)
        }
      })

    const _auth = JSON.parse(localStorage.getItem('auth'))
    if (_auth !== null) {
      setAuth(_auth)
      searchFavorite({
        user_id: _auth.id,
        data_id: id,
        category1: '个人用户',
        category2: '校园招聘',
      }).then(res => {
        if (res.content) {
          setFavorite(p => res.content)
        }
      })

      fetch(`./api/common-user-schedule/user/${_auth.id}/${id}`)
        .then(res => res.json())
        .then(res => {
          setSchedule(res.content)
        })
    }
  }, [id, search])


  const handleFavorite = () => {
    if (auth) {
      if (favorite) {
        fetch(`./api/favorite/${favorite.id}/`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(res => {
            if (res.message === '') {
              setFavorite(false)
            } else {
              alert(res.message)
            }
          })
      } else {
        FavoriteJournal({
          data_id: id,
          data_uuid: item.uuid,
          category2: '校园招聘'
        }, res => {
          if (res.message === '') {
            searchFavorite({
              user_id: auth.id,
              data_id: id,
              category1: '个人用户',
              category2: '校园招聘',
            }).then(res1 => {
              if (res1.content) {
                setFavorite(p => res1.content)
              }
            })
          } else {
            alert(res.message)
          }
        })
      }
    } else {
      window.location = '#登录'
    }
  }


  const handleSchedule = () => {
    fetch(`./api/common-user-schedule/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        common_user_id: auth.id,
        campus_id: id,
        name: item.title
      })
    })
      .then(res => res.json())
      .then(res => {
        _EditJournal({
          category2: '日程',
          data_id: item.id,
          data_uuid: item.uuid,
          remark: `将<${item.title}>加入日程`
        }, re => { })
        setSchedule({ id: res.content })
      })
  }

  const deleteSchedule = () => {
    fetch(`./api/common-user-schedule/${schedule.id}?d=${id}&uuid=${auth.uuid}&u=${auth.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(res => {
        _EditJournal({
          category2: '日程',
          data_id: item.id,
          data_uuid: item.uuid,
          remark: `将<${item.title}>移出日程`
        }, re => { })
        setSchedule(false)
      })
  }


  return item === 0 ? (
    <div className="container-fluid" style={{ fontSize: 14 }}>
      <ToBack />
    </div>) : (
      <>
        <div className="container-fluid" style={{ fontSize: 14 }}>
          <div className="card border-0 shadow mt-2">
            <div className="card-body">
              <ToBack category={item.title} />
              <div className="row">
                <div className="col strong-center">
                  <strong>{item.title}</strong>
                  <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  举办方: {item.school}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  举办时间: {item.date} {item.time}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  举办地点: {item.address_level1}-{item.address_level2}-{item.address_level3}
                  <br />{item.address_level4}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  简介:
            </div>
              </div>
              <div className="row ">
                <div className="col editor-body" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </div>
          </div>
        </div>
        <ul className="nav bg-light nav-light fixed-bottom nav-bottom border-top" >
          <div className="row text-center nav-row">
            <div className="col nav-col" >
              <button className="btn btn-light nav-btn text-muted text-small" onClick={handleFavorite}>
                {
                  favorite ?
                    (<i className="fa fa-star" style={{ color: '#FFFF00' }} aria-hidden="true"></i>) :
                    (<i className="fa fa-star-o" aria-hidden="true"></i>)
                }
                收藏
              </button>
            </div>
            <div className="col nav-col">
              {
                schedule ? (
                  <button className="btn btn-danger nav-btn" onClick={deleteSchedule}>
                    <i className="fa fa-minus-circle fa-fw" aria-hidden="true"></i>
                    移出日程
                  </button>) : (
                    <button className="btn btn-success nav-btn" onClick={handleSchedule}>
                      <i className="fa fa-plus-circle fa-fw" aria-hidden="true"></i>
                      加入日程
                    </button>)
              }
            </div>
          </div>
        </ul>
      </>
    )
}


export default Details