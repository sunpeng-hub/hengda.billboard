import React, { useState } from 'react';

import Navbar from '../component/Navbar';
import SideNav from './component/SideNav';
import IndustryPicker from '../component/IndustryPicker';

export default function MassMessage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dday, setDday] = useState('');
  const [receiver, setReceiver] = useState('');
  const [address_level1, setAddressLevel1] = useState('');
  const [address_level2, setAddressLevel2] = useState('');
  const [industry, setIndustry] = useState('');

  return (
    <>
      <Navbar category="系统设置" />

      <div className="container mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>群发消息</h3>
            <hr />

            <div className="card bg-dark shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>标题</label>
                      <input
                        type="text"
                        value={title}
                        className="form-control"
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label>有效期</label>
                    <input
                      type="date"
                      value={dday}
                      className="form-control"
                      onChange={(event) => setDday(event.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>内容</label>
                  <textarea value={content} rows="3" className="form-control" onChange={(event) => setContent(event.target.value)} />
                </div>

                <div className="form-group">
                  <label>发送对象</label>
                  <select value={receiver} className="form-control" onChange={(event) => setReceiver(event.target.value)}>
                    <option value="">未选择</option>
                    <option value="企业用户">企业用户</option>
                    <option value="普通用户">普通用户</option>
                  </select>
                </div>

                {receiver === '企业用户' && (
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label>地址</label>
                        <select value="address_level1" className="form-control" onChange={(event) => setAddressLevel1(event.target.value)}>
                          <option>1</option>
                        </select>
                      </div>
                    </div>

                    <div className="col">
                      <div className="col">
                        <div className="form-group">
                          <label>&nbsp;</label>
                          <select value="address_level2" className="form-control" onChange={(event) => setAddressLevel2(event.target.value)}>
                            <option>1</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <IndustryPicker caption="行业" />
                    </div>
                  </div>
                )}

                {receiver === '普通用户' && (
                  <span className="lead">普通用户</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
