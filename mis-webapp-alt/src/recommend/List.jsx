import React, { useState, useEffect } from 'react';

import Navbar from '../component/Navbar';
import Toolbar from './ComponentToolbar';

export default function List() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await window.fetch('/api/content/recommend/');
      const res = await response.json();
      setList(res.content);
    })();
  }, []);

  return (
    <>
      <Navbar category="推荐信息" />

      <div className="container mt-3 mb-5">
        <h3>推荐信息</h3>
        <hr />

        <Toolbar />

        <div className="card bg-dark shadow">
          <div className="card-body">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th className="text-right">序号</th>
                  <th>分类</th>
                  <th>标题</th>
                  <th>发布/截止日期</th>
                </tr>
              </thead>

              <tbody>
                {list.map((it) => (
                  <tr key={it.id}>
                    <td className="text-right">
                      <span className="pull-left">
                        <a href={`#/${it.id}?uuid=${it.uuid}`}>
                          <i className="fa fa-fw fa-edit" />
                        </a>
                      </span>
                      {it.id}
                    </td>
                    <td>{it.category}</td>
                    <td>{it.title}</td>
                    <td>
                      {it.date1}
                      <br />
                      {it.date2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}