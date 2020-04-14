import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route, useParams, useLocation } from 'react-router-dom'
import md5 from 'blueimp-md5'
import moment from 'moment'

import { Title, Navbar, BackwardButton, InputRowField, RefreshButton } from './Components'

export default function CommonUserRouter() {
  useEffect(() => {
    const auth = sessionStorage.getItem('mis-auth')
    if (!!!auth) {
      window.location = '#登录'
    }
  }, [])

  return (
    <Router>
      <Switch>
        <Route exact path="/普通用户"><List /></Route>
        <Route exact path="/普通用户/新增"><Detail category="新增" /></Route>
        <Route exact path="/普通用户/:id"><Detail category="编辑" /></Route>
        <Route path="/普通用户/:id/投递记录"><DeliveryList /></Route>
        <Route path="/普通用户/:id/登录记录"><Journal category="登录" /></Route>
        <Route path="/普通用户/:id/浏览记录"><Journal category="浏览" /></Route>
        <Route path="/普通用户/:id/编辑记录"><Journal category="编辑" /></Route>
      </Switch>
    </Router>
  )
}

export function SideNav(props) {
  return (
    <div className="list-group">
      <h6 className="text-muted">
        <strong>选择功能</strong>
      </h6>

      <div>
        <a href="#普通用户"
          className={`text-small list-group-item list-group-item-action ${props.category === '列表' ? 'active' : ''}`}
        >
          用户列表
          <span className="pull-right">
            <i className="fa fa-fw fa-angle-right"></i>
          </span>
        </a>

        <a href="#普通用户/新增"
          className={`text-small list-group-item list-group-item-action ${props.category === '新增' ? 'active' : ''}`}
        >
          新增用户
          <span className="pull-right">
            <i className="fa fa-fw fa-angle-right"></i>
          </span>
        </a>
      </div>
    </div>
  )
}

function List() {
  const [data, setData] = useState([])
  const [filter_name, setFilterName] = useState('')

  const handleFilter = async () => {
    const response = await window.fetch(`/api/common-user/`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ filter_name: filter_name })
    })
    const res = await response.json()
    if (res.message) {
      window.alert(res.message)
      return
    }
    setData(res.content)
  }

  return (
    <>
      <Title />
      <Navbar category="普通用户" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav category="列表" />
          </div>

          <div className="col-9 col-lg-10">
            <h3>普通用户 列表</h3>
            <hr />

            <div className="alert alert-warning" role="alert">
              <ul>
                <li>简历中的地址由地址组件选择</li>
                <li>简历中的自我评价改为RTE</li>
              </ul>
            </div>

            <div className="card shadow">
              <div className="card-header">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">姓名</span>
                      </div>

                      <input type="text" value={filter_name} aria-label="企业名称"
                        className="form-control"
                        onChange={event => setFilterName(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-info" onClick={handleFilter}>
                        查询
                      </button>

                      <RefreshButton caption="重置" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-right">序号</th>
                      <th>用户</th>
                      <th>EMAIL</th>
                      <th>电话</th>
                      <th>投递</th>
                      <th>收藏</th>
                      <th className="text-right">查看</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map(it => (
                      <tr key={it.id}>
                        <td>
                          <a href={`#普通用户/${it.id}?uuid=${it.uuid}`}>
                            <i className="fa fa-fw fa-edit"></i>
                          </a>
                          <span className="pull-right">{it.id}</span>
                        </td>
                        <td>{it.name}<br />({it.username})</td>
                        <td>{it.email}</td>
                        <td>{it.phone}</td>
                        <td>{it.qty_delivery}</td>
                        <td>{it.qty_favorite}</td>
                        <td className="text-right">
                          {/**
                          <ul className="list-inline">
                            <li className="list-inline-item">
                              <a href={`#普通用户/${it.id}/登录记录`}>登录记录</a>
                            </li>
                            <li className="list-inline-item">
                              <a href={`#普通用户/${it.id}/浏览记录`}>浏览记录</a>
                            </li>
                            <li className="list-inline-item">
                              <a href={`#普通用户/${it.id}/编辑记录`}>编辑记录</a>
                            </li>
                          </ul>
                          **/}
                          <div className="btn-group">
                            <button type="button" className="btn btn-outline-warning btn-sm"
                              onClick={() => window.location = `#普通用户/${it.id}/登录记录`}
                            >
                              登录记录
                            </button>

                            <button type="button" className="btn btn-outline-info btn-sm"
                              onClick={() => window.location = `#普通用户/${it.id}/浏览记录`}
                            >
                              浏览记录
                            </button>

                            <button type="button" className="btn btn-outline-success btn-sm"
                              onClick={() => window.location = `#普通用户/${it.id}/编辑记录`}
                            >
                              编辑记录
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Detail(props) {
  const { id } = useParams()
  const location = useLocation()
  const [uuid, setUUID] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [resume_list, setResumeList] = useState([])

  useEffect(() => {
    if (props.category === '编辑') {
      const _uuid = new URLSearchParams(location.search).get('uuid')
      setUUID(_uuid)
      ;(async (id, uuid) => {
        const response = await window.fetch(`/api/common-user/${id}?uuid=${uuid}`)
        const res = await response.json()
        if (res.message) {
          window.console.error(res.message)
          return
        }
        setName(res.content.name)
        setUsername(res.content.username)
        setEmail(res.content.email)
        setPhone(res.content.phone)
      })(id, _uuid)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.category === '编辑') {
      ;(async id => {
        const response = await window.fetch(`/api/common-user/${id}/resume/`)
        const res = await response.json()
        if (res.message) {
          window.console.error(res.message)
          return
        }
        setResumeList(res.content)
      })(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemove = async () => {
    if (!!!window.confirm('确定删除当前数据？')) return
    const response = await window.fetch(`/api/common-user/${id}?uuid=${uuid}`, {
      method: 'DELETE'
    })
    const res = await response.json()
    if (res.message) {
      window.alert(res.message)
      return
    }
    window.history.go(-1)
  }

  const handleSubmit = async () => {
    if (props.category === '新增') {
      const response = await window.fetch(`/api/common-user/`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name,
          username: username,
          password: md5(password),
          email: email,
          phone: phone
        })
      })
      const res = await response.json()
      if (res.message) {
        window.alert(res.message)
        return
      }
      window.history.go(-1)
    } else if (props.category === '编辑') {
      const response = await window.fetch(`/api/common-user/${id}?uuid=${uuid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name,
          username: username,
          email: email,
          phone: phone
        })
      })
      const res = await response.json()
      if (res.message) {
        window.alert(res.message)
        return
      }
      window.history.go(-1)
    }
  }

  return (
    <>
      <Title />
      <Navbar category="普通用户" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>{props.category} 普通用户</h3>
            <hr />

            <div className="row">
              <div className="col-8">
                <div className="card shadow">
                  <div className="card-header">用户信息</div>

                  <div className="card-body">
                    <InputRowField caption="姓名" value={name || ''}
                      onChange={event => setName(event.target.value)}
                    />

                    <InputRowField caption="用户名" value={username || ''}
                      onChange={event => setUsername(event.target.value)}
                    />

                    {
                      props.category === '新增' && (
                        <InputRowField caption="密码" value={password || ''}
                          onChange={event => setPassword(event.target.value)}
                        />
                      )
                    }

                    <InputRowField caption="EMAIL" value={email || ''}
                      onChange={event => setEmail(event.target.value)}
                    />

                    <InputRowField caption="电话" value={phone || ''}
                      onChange={event => setPhone(event.target.value)}
                    />
                  </div>

                  <div className="card-footer">
                    <div className="btn-group">
                      <BackwardButton />
                    </div>

                    <div className="btn-group pull-right">
                      {
                        props.category === '编辑' && (
                          <button type="button" className="btn btn-outline-danger"
                            onClick={handleRemove}
                          >
                            <i className="fa fa-fw fa-trash-o"></i>
                            删除
                          </button>
                        )
                      }

                      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                        <i className="fa fa-fw fa-save"></i>
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                {
                  props.category === '编辑' && (
                    <div className="card shadow">
                      <div className="card-header">用户简历</div>

                      <div className="card-body">
                        <div className="list-group">
                          {
                            resume_list.map(it => (
                              <a href={`#简历/${it.id}?master_id=${id}&uuid=${it.uuid}`} className="list-group-item list-group-item-action" key={it.id}>
                                {it.qiwangzhiwei}
                                <span className="pull-right text-muted">{it.yixiangchengshi}</span>
                              </a>
                            ))
                          }
                        </div>
                      </div>

                      <div className="card-footer text-center">
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-outline-success"
                            onClick={() => window.location = `#简历/新增?master_id=${id}`}
                          >
                            <i className="fa fa-fw fa-plus"></i>
                            添加简历
                          </button>

                          <button type="button" className="btn btn-sm btn-outline-info"
                            onClick={() => window.location = `#普通用户/${id}/投递记录`}
                          >
                            <i className="fa fa-fw fa-list"></i>
                            投递记录
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }

                {
                  props.category === '编辑' && (
                    <div className="mt-3">
                      <button type="button" className="btn btn-block btn-outline-secondary"
                        onClick={() => window.location = `#收藏?master_id=${id}`}
                      >
                        用户收藏
                      </button>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DeliveryList() {
  const { id } = useParams()
  const [filter_date_begin, setFilterDateBegin] = useState(moment().format('YYYY-MM-DD'))
  const [filter_date_end, setFilterDateEnd] = useState(moment().format('YYYY-MM-DD'))
  const [data, setData] = useState([])

  const handleFilter = async () => {
    const response = await window.fetch(`/api/common-user/${id}/delivery/`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        filter_date_begin: filter_date_begin,
        filter_date_end: filter_date_end
      })
    })
    const res = await response.json()
    if (res.message) {
      window.alert(res.message)
      return
    }
    setData(res.content)
  }

  return (
    <>
      <Title />
      <Navbar category="普通用户" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>普通用户 简历投递记录</h3>
            <hr />

            <div className="btn-group mb-3">
              <BackwardButton />
            </div>

            <div className="card shadow">
              <div className="card-header">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">起始日期</span>
                      </div>
                      <input type="date" value={filter_date_begin} aria-label="起始日期"
                        className="form-control"
                        onChange={event => setFilterDateBegin(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">终止日期</span>
                      </div>
                      <input type="date" value={filter_date_end} aria-label="终止日期"
                        className="form-control"
                        onChange={event => setFilterDateEnd(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-info" onClick={handleFilter}>
                        查询
                      </button>

                      <RefreshButton caption="重置" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th className="text-right">序号</th>
                      <th>简历</th>
                      <th>岗位</th>
                      <th>日期</th>
                      <th>状态</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      data.length === 0 && (
                        <tr><td>无数据</td></tr>
                      )
                    }
                    {
                      data.map(it => (
                        <tr key={it.id}>
                          <td className="text-right">{it.id}</td>
                          <td>
                            <a href={`#普通用户/${id}/简历/${it.resume_id}`}>{it.resume_name}</a>
                          </td>
                          <td>
                            <a href={`#岗位/${it.recruitment_id}`}>{it.recruitment_name}</a>
                          </td>
                          <td>{it.datime}</td>
                          <td>{it.status}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Journal(props) {
  const { id } = useParams()
  const [data, setData] = useState([])
  const [filter_date_begin, setFilterDateBegin] = useState(moment().format('YYYY-MM-DD'))
  const [filter_date_end, setFilterDateEnd] = useState(moment().format('YYYY-MM-DD'))

  useEffect(() => {
    if (props.category === '登录') {
      (async id => {
        const response = await window.fetch(`/api/common-user/${id}/journal/sign-in/`)
        const res = await response.json()
        if (res.message) {
          window.console.error(res.message)
          return
        }
        setData(res.content)
      })(id)
    } else if (props.category === '浏览') {
      (async id => {
        const response = await window.fetch(`/api/common-user/${id}/journal/browse/`)
        const res = await response.json()
        if (res.message) {
          window.console.error(res.message)
          return
        }
        setData(res.content)
      })(id)
    } else if (props.category === '编辑') {
      (async id => {
        const response = await window.fetch(`/api/common-user/${id}/journal/edit/`)
        const res = await response.json()
        if (res.message) {
          window.console.error(res.message)
          return
        }
        setData(res.content)
      })(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilter = async () => {
    if (props.category === '登录') {
      const response = await window.fetch(`/api/common-user/${id}/journal/sign-in/`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date_begin: filter_date_begin,
          date_end: filter_date_end
        })
      })
      const res = await response.json()
      if (res.message) {
        window.alert(res.message)
        return
      }
      setData(res.content)
    } else if (props.category === '浏览') {
      const response = await window.fetch(`/api/common-user/${id}/journal/browse/`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date_begin: filter_date_begin,
          date_end: filter_date_end
        })
      })
      const res = await response.json()
      if (res.message) {
        window.alert(res.message)
        return
      }
      setData(res.content)
    } else if (props.category === '编辑') {
      const response = await window.fetch(`/api/common-user/${id}/journal/edit/`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date_begin: filter_date_begin,
          date_end: filter_date_end
        })
      })
      const res = await response.json()
      if (res.message) {
        window.alert(res.message)
        return
      }
      setData(res.content)
    }
  }

  return (
    <>
      <Title />
      <Navbar category="普通用户" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>普通用户 {props.category}记录</h3>
            <hr />

            <div className="btn-group mb-3">
              <BackwardButton />
            </div>

            <div className="card shadow">
              <div className="card-header">
                <div className="row">
                  <div className="col row">
                    <div className="input-group col">
                      <div className="input-group-prepend">
                        <span className="input-group-text">起</span>
                      </div>
                      <input type="date" value={filter_date_begin || ''} aria-label="起"
                        className="form-control"
                        onChange={event => setFilterDateBegin(event.target.value)}
                      />
                    </div>

                    <div className="input-group col">
                      <div className="input-group-prepend">
                        <span className="input-group-text">止</span>
                      </div>
                      <input type="date" value={filter_date_end || ''} aria-label="止"
                        className="form-control"
                        onChange={event => setFilterDateEnd(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="btn-group pull-right">
                      <button type="button" className="btn btn-outline-info" onClick={handleFilter}>
                        查询
                      </button>

                      <RefreshButton caption="重置" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <table className="table table-hover table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-right">序号</th>
                      {
                        props.category === '登录' && (
                          <>
                            <th>时间</th>
                            <th>IP地址</th>
                            <th>大概位置</th>
                            <th>用户类别</th>
                          </>
                        )
                      }
                      {
                        props.category === '浏览' && (
                          <>
                            <th>时间</th>
                            <th>数据类别</th>
                            <th className="text-right">操作</th>
                          </>
                        )
                      }
                      {
                        props.category === '编辑' && (
                          <>
                            <th>时间</th>
                            <th>用户类别</th>
                            <th>操作内容</th>
                          </>
                        )
                      }
                    </tr>
                  </thead>

                  <tbody>
                    {
                      props.category === '登录' && data.map(it => (
                        <tr key={it.id}>
                          <td className="text-right">{it.id}</td>
                          <td>{it.datime}</td>
                          <td>{it.ip}</td>
                          <td>{it.address}</td>
                          <td>{it.category}</td>
                        </tr>
                      ))
                    }
                    {
                      props.category === '浏览' && data.map(it => (
                        <tr key={it.id}>
                          <td className="text-right">{it.id}</td>
                          <td>{it.datime}</td>
                          <td>{it.category}</td>
                          <td className="text-right">
                            <button type="button" data-id={it.data_id}
                              className="btn btn-sm btn-outline-info"
                              onClick={() => window.location = `#岗位/${it.data-id}`}
                            >
                              查看
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                    {
                      props.category === '编辑' && data.map(it => (
                        <tr key={it.id}>
                          <td className="text-right">{it.id}</td>
                          <td>{it.datime}</td>
                          <td>{it.category1}</td>
                          <td>{it.category2}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
