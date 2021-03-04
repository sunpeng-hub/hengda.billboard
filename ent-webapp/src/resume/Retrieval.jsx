import React, { useState, useEffect } from 'react';

import { View } from './Components';
import { TextField, SelectField, IndustrySearchField } from '../components/InputField';

const Retrieval = () => {
  const [list, setList] = useState([]);

  const [param, setParam] = useState({
    qiwanghangye: '',
    qiwangzhiwei: '',
    address2: '',
    education: '本科',
  });

  const [page, setPage] = useState(0);

  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const _auth = JSON.parse(sessionStorage.getItem('auth'));
    if (_auth !== null) {
      fetch('/api/resume/filter?filter=employer-filter', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          page: 0,
          education: '本科',
          address2: '',
          qiwanghangye: '',
          qiwangzhiwei: '',
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
        })
        .then((res) => {
          console.log(res);
          if (res) {
            setList(res);
          } else {
            window.alert('暂时没有数据');
          }
        });
    }
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setParam((prev) => ({ ...prev, [name]: value }));
  };

  const search = () => {
    fetch('/api/resume/filter?filter=employer-filter', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...param,
        page: page,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setList(res);
        } else {
          window.alert('暂时还没有数据');
        }
      });
  };

  const up = () => {
    fetch('/api/resume/filter?filter=employer-filter', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...param,
        page: page - 1,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setList(res);
        }
      });
    setPage(page - 1);
    setFlag(true);
  };

  const down = () => {
    fetch('/api/resume/filter?filter=employer-filter', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...param,
        page: page + 1,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setList(res);
          setPage(page + 1);
        } else {
          setFlag(false);
          alert('已经到头了');
        }
      });
  };

  return (
    <View category="检索">
      <div className="row px-5 pt-2 bg-white shadow">
        {/* <div className="col">
          <SelectField category="活跃度" name="day" value={param.day} handleChange={handleChange}>
            <option value="0">近24小时</option>
            <option value="2">近3天</option>
            <option value="6">近7天</option>
          </SelectField>
        </div>
        <div className="col">
          <TextField category="姓名" name="name" value={param.name} handleChange={handleChange} />
        </div> */}
        <IndustrySearchField
          industry={param.qiwanghangye}
          position={param.qiwangzhiwei}
          handleChange={handleChange}
        />
        <div className="col">
          <TextField
            category="期望地点"
            name="address2"
            value={param.address2}
            handleChange={handleChange}
          />
        </div>
        <div className="col">
          <SelectField
            category="学历"
            name="education"
            value={param.education}
            handleChange={handleChange}
          >
            <option>本科</option>
            <option>高中及以下</option>
            <option>大专</option>
            <option>硕士</option>
            <option>博士</option>
          </SelectField>
        </div>
        <div className="col">
          <br />
          <button onClick={search} className="btn btn-primary rounded-0" type="button">
            查询
          </button>
        </div>
      </div>

      <div className="row mt-3 bg-white shadow card">
        <div className="col-12 rounded-0">
          <div className="card-body">
            <h3 className="pull-left">简历检索</h3>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">姓名</th>
                  <th scope="col">期望行业</th>
                  <th scope="col">期望职位</th>
                  <th scope="col">期望地点</th>
                  <th scope="col">毕业院校</th>
                  <th scope="col">学历</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                {list &&
                  list.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qiwanghangye}</td>
                      <td>{item.qiwangzhiwei}</td>
                      <td>{item.address2}</td>
                      <td>{item.school}</td>
                      <td>{item.education}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <a
                            className="btn btn-primary"
                            href={`#简历/检索/详情/${item.id}?u_id=${item.uuid}`}
                          >
                            查看
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col text-right">
            {page === 0 ? (
              <button
                disabled="disabled"
                className="btn btn-outline-primary"
                onClick={up}
                type="button"
              >
                上一页
              </button>
            ) : (
              <button className="btn btn-outline-primary" onClick={up} type="button">
                上一页
              </button>
            )}
          </div>
          <div className="col-1 text-center p-1">{page + 1}</div>
          <div className="col">
            {flag ? (
              <button className="btn btn-outline-primary" type="button" onClick={down}>
                下一页
              </button>
            ) : (
              <button
                disabled="disabled"
                className="btn btn-outline-primary"
                type="button"
                onClick={down}
              >
                下一页
              </button>
            )}
          </div>
        </div>
      </div>
    </View>
  );
};

export default Retrieval;
