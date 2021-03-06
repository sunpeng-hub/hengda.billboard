import React, { useEffect, useState } from 'react';
import TextCheckbox from '../components/Button';
import { RecruitmentRow1 } from '../components/DataRow';
import CityDropdowns from '../components/CityDropdowns';
import Navbar from '../components/Navbar';

const KeywordSearch = () => {
  const [types, setTypes] = useState({});

  const [list, setList] = useState([]);

  const [city, setCity] = useState('');

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    document.title = '岗位/企业查询';
  }, []);

  const search = (param) => {
    fetch('./api/recruitment/keyword-search/', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(param),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.content) {
          setList(res.content);
        } else {
          alert(res.message);
        }
      });
  };

  const _onCheckboxChange = ({ name, checked }) => {
    search({
      city,
      ...types,
      keyword,
      [name]: checked,
    });
    setTypes((p) => ({
      ...p,
      [name]: checked,
    }));
  };

  const handleChange = (val) => {
    search({
      city: val,
      status: '在招',
      keyword,
      ...types,
    });
    setCity(val);
  };

  const _οnkeypress = (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13 && event.target.value !== '') {
      search({
        city,
        status: '在招',
        keyword: event.target.value,
        ...types,
      });
      setKeyword(event.target.value);
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
              placeholder="按照企业/职位名称查询"
              onKeyPress={_οnkeypress}
              autoFocus
              style={{ outline: 0, height: 35 }}
            />
          </div>
        </div>
        <div className="card border-0 shadow">
          <div className="card-body">
            <div className="row mb-3" style={{ fontSize: 14 }}>
              <div className="col">
                <CityDropdowns handleChange={handleChange} />
              </div>
              <div className="col flex-end">
                <div className="pull-right text-primary">
                  <TextCheckbox name="category1" onChange={_onCheckboxChange}>
                    兼职
                  </TextCheckbox>
                  <TextCheckbox name="category2" onChange={_onCheckboxChange}>
                    全职
                  </TextCheckbox>
                  <TextCheckbox name="category3" onChange={_onCheckboxChange}>
                    实习
                  </TextCheckbox>
                </div>
              </div>
            </div>
            {list && list.map((item) => <RecruitmentRow1 key={item.id} {...item} />)}
          </div>
        </div>
      </div>
      <Navbar category="岗位" />
    </>
  );
};

export default KeywordSearch;
