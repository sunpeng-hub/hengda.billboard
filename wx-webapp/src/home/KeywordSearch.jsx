import React, { useEffect, useState } from 'react';
import {  RecommendRow1 } from '../components/DataRow';
import Navbar from '../components/Navbar';

const KeywordSearch = () => {
  const [list, setList] = useState([]);

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    document.title = '推荐信息查询';
  }, []);

  const search = () => {
    fetch('./api/recommend/filter?filter=wx-default-list', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        category: '国企,公务员,事业单位,教师,其他',
        address_level2: '',
        keyword: keyword,
        page: 1,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setList(res);
        }
      });
  };

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const _οnkeypress = (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13 && event.target.value !== '') {
      search({
        keyword: event.target.value,
      });
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row pb-2 pt-1 bg-transparent">
          <div className="col">
            <input
              type="text"
              id="search"
              className="w-100 border-0 text-center rounded-pill"
              placeholder="按照标题或城市名称查询"
              onChange={handleChange}
              onKeyPress={_οnkeypress}
              autoFocus
              style={{ outline: 0, height: 35 }}
            />
          </div>
        </div>
        <div className="card border-0 shadow">
          <div className="card-body">
            {list && list.map((item) => <RecommendRow1 key={item.id} {...item} />)}
          </div>
        </div>
      </div>
      <Navbar category="首页" />
    </>
  );
};

export default KeywordSearch;
