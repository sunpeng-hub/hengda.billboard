import React, { useState, useEffect } from 'react';

// import Title from '../components/Title'
import Navbar from '../components/Navbar';
import PlayImg from '../components/PlayImg';
import TextCheckbox from '../components/Button';
import { RecruitmentRow1 } from '../components/DataRow';
import CityDropdowns from '../components/CityDropdowns';

const List = () => {
  const [types, setTypes] = useState({});

  const [list, setList] = useState([]);

  const [city, setCity] = useState('');

  useEffect(() => {
    document.title = '岗位';
    fetch('./api/recruitment/search/', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        status: '在招',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.content) {
          setList(res.content);
        } else {
          alert(res.message);
        }
      });
  }, []);

  const search = (param) => {
    fetch('./api/recruitment/search/', {
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
      ...types,
    });
    setCity(val);
  };

  return (
    <>
      <div className="container-fluid">
        {/* <Title category="岗位" /> */}
        <PlayImg category="小程序-岗位" />
        <div className="row pb-2 pt-2" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="col">
            <input
              type="text"
              className="w-100 border-0 text-center rounded-pill"
              placeholder="按照企业/职位名称查询"
              onClick={() => {
                window.location = '#岗位/查询/';
              }}
              style={{ outline: 0, height: 35 }}
            />
          </div>
        </div>
        <div className="card border-0 mt-1 shadow">
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
            {list &&
              list.map((item) => (
                <div key={item.id}>
                  <RecruitmentRow1 {...item} />
                  <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <Navbar category="岗位" />
    </>
  );
};

export default List;
