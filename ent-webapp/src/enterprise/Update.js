import React, { useEffect, useState } from 'react'
import watermark from 'watermarkjs'

import { View } from './Components'
import level from '../components/level.json'
import { TextField, SelectField } from '../components/InputField'

const Update = () => {

  const [data, setData] = useState({
    yingyezhizhao: '',
    faren: '',
    zhuceriqi: '',
    zhuziguimo: '',
    yuangongshuliang: '',
    yingyezhizhao_tu: '',
    address1: '',
    address2: '',
    address3: '',
    address4: ''
  })

  const [auth, setAuth] = useState(0)

  const [city, setCity] = useState([])

  const [area, setArea] = useState([])

  useEffect(() => {
    const _auth = JSON.parse(sessionStorage.getItem('auth'))
    if (_auth === null) {
      window.location = '#登录'
      return
    } else {
      setAuth(_auth)
      fetch(`./api/enterprise/${_auth.enterprise_id}?u_id=${_auth.uuid}`)
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(window.message)
          } else {
            setData(res.content)
          }
        })
    }
  }, [])

  const handleChange = e => {
    const { value, name } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    fetch(`./api/enterprise/${auth.enterprise_id}?u_id=${auth.uuid}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          window.alert(res.message)
        } else {
          window.alert('操作成功')
          window.location = '#信息'
        }
      })
  }

  const handleFileChange = e => {
    if (e.target.files.length === 0) {
      return
    }
    watermark([e.target.files[0]])
    .dataUrl(watermark.text.center('仅用于公示,其他用途无效', '100px Josefin Slab', '#FE0000', 0.5))
    .then(url => {
      setData({
        ...data,
        yingyezhizhao_tu: url
      })
    })
  }

  const handleUpload = () => {
    document.getElementById('file').click()
  }


  const handleProvince = e => {
    const value = e.target.value
    if (value !== '') {
      switch (value) {
        case '北京市':
        case '上海市':
        case '天津市':
        case '重庆市':
          setData({
            ...data,
            address1: value,
            address2: value
          })
          const item = level.find(item => item.name === value)
          setCity([item])
          setArea(item.children.filter(it => it.province === item.code.slice(0, 2)))
          break
        default:
          setData({
            ...data,
            address1: value
          })
          setCity(level.find(item => item.name === value).children)
          setArea([])
      }
    } else {
      setData({
        ...data,
        address1: value,
        address2: value,
        address3: value
      })
      setCity([])
      setArea([])
    }
  }

  const handleCity = e => {
    const value = e.target.value
    if (value !== '') {
      setData({
        ...data,
        address2: value
      })
      const item = city.find(it => it.name === value)
      setArea(item.children.filter(it => it.province === item.code.slice(0, 2)))
    } else {
      setData({
        ...data,
        address2: value,
        address3: value
      })
      setArea([])
    }
  }


  return (
    <View category="企业信息">
      <div className="row bg-white shadow">
        <div className="col card rounded-0">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <h3 className="pull-left">工商信息</h3>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-3 col-md-4">
                <TextField
                  category="企业号"
                  name="yingyezhizhao"
                  value={data.yingyezhizhao}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-3 col-md-4">
                <TextField
                  category="法人"
                  name="faren"
                  value={data.faren}
                  handleChange={handleChange} />
              </div>
              <div className="col-3 col-md-4">
                <div className="form-group">
                  <label>注册日期</label>
                  <input type="date"
                    name="zhuceriqi"
                    value={data.zhuceriqi}
                    onChange={handleChange}
                    className="form-control form-control-sm rounded-0" />
                </div>
              </div>
              <div className="col-3 col-md-4">
                <TextField
                  category="注资规模"
                  name="zhuziguimo"
                  value={data.zhuziguimo}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-3 col-md-4">
                <TextField
                  category="员工数量"
                  name="yuangongshuliang"
                  value={data.yuangongshuliang}
                  handleChange={handleChange} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <h3 className="pull-left">公司地址</h3>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-3 col-md-4">
                <SelectField
                  category="省/直辖市"
                  name="address1"
                  value={data.address1}
                  handleChange={handleProvince}>
                  <option></option>
                  {
                    level.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
              <div className="col-3 col-md-4">
                <SelectField
                  category="市"
                  name="address2"
                  value={data.address2}
                  handleChange={handleCity}>
                  <option></option>
                  {
                    city.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
              <div className="col-3 col-md-4">
                <SelectField
                  category="区"
                  name="address3"
                  value={data.address3}
                  handleChange={handleChange}>
                  <option></option>
                  {
                    area.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>详细地址</label>
                  <textarea
                    name="address4"
                    value={data.address4}
                    onChange={handleChange}
                    rows="1"
                    className="form-control form-control-sm rounded-0" />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <h3 className="pull-left">营业执照</h3>
                <div className="pull-right">
                  <button className="btn btn-primary" onClick={handleUpload} >
                    <i className="fa fa-upload" ></i>
                    上传图片
                  </button>
                  <input type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file"
                    accept="image/png, image/jpeg" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <img id="img" src={data.yingyezhizhao_tu} className="w-50" alt="" />
              </div>
            </div>
            <hr />
            <div className="row mt-2">
              <div className="col">
                <a className="pull-left btn btn-primary" href={'#信息'}>
                  返回
                </a>
                <button className="pull-right btn btn-success" onClick={handleSave}>
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </View>
  )
}

export default Update