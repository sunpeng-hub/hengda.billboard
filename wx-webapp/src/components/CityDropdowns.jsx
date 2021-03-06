import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const CityDropdowns = (props) => {
  const [show, setShow] = React.useState(false);

  const [childMenu, setChildMenu] = React.useState([]);

  const [province, setProvince] = React.useState('');

  const [value, setValue] = React.useState('');

  const [level, setLevel] = React.useState([]);

  const [address, setAddress] = React.useState([]);

  useEffect(() => {
    if (props.defaultValue) {
      setValue(props.defaultValue);
    }
    fetch('/lib/address.json')
      .then((res) => res.json())
      .then((res) => {
        setAddress(res);
        setLevel(
          Object.getOwnPropertyNames(res)
            .filter((item) => item.slice(2, 7) === '0000')
            .map((code) => ({
              code,
              name: res[code],
            })),
        );
      });
  }, [props]);

  const menuShow = () => {
    setShow(!show);
  };

  const childMenuShow = (item) => {
    if (
      item.code === '110000' ||
      item.code === '120000' ||
      item.code === '310000' ||
      item.code === '500000'
    ) {
      setChildMenu([]);
      setShow(false);
      setProvince(item.name);
      setValue(item.name);
      if (props.handleChange) {
        props.handleChange(item.name);
      }
    } else {
      setProvince(item.name);
      setChildMenu(
        Object.getOwnPropertyNames(address)
          .filter((it) => {
            return (
              item.code.slice(0, 2) === it.slice(0, 2) &&
              it.slice(4, 7) === '00' &&
              it !== item.code
            );
          })
          .map((code) => ({
            code,
            name: address[code],
          })),
      );
    }
  };

  const handleClick = (item) => {
    setValue(item.name);
    setShow(false);
    if (props.handleChange) {
      props.handleChange(item.name);
    }
  };

  const _class = (v1, v2) => (v1 === v2 ? 'text-primary font-weight-bold' : 'text-muted');

  const clear = () => {
    setShow(false);
    setProvince('');
    setValue('');
    if (props.handleChange) {
      props.handleChange('');
    }
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-link btn-sm dropdown-toggle"
        onClick={menuShow}
        style={{ padding: 0 }}
      >
        <FontAwesomeIcon icon={faBuilding} fixedWidth />
        {value || '城市'}
      </button>
      <div
        className={`dropdown-menu ${show && 'show'}`}
        style={{ width: 210, minWidth: 110, height: 215 }}
      >
        <div className="row">
          <div className="col border-right" style={{ height: 200, overflowY: 'scroll' }}>
            <span aria-hidden="true" className="font-weight-bold text-danger" onClick={clear}>
              &nbsp;&nbsp;&nbsp;清空
            </span>
            <br />
            {level.map((item) => (
              <React.Fragment key={item.code}>
                <span
                  aria-hidden="true"
                  className={_class(item.name, province)}
                  onClick={() => childMenuShow(item)}
                >
                  &nbsp;&nbsp;&nbsp;
                  {item.name}
                </span>
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="col" style={{ height: 200, overflowY: 'scroll' }}>
            {childMenu.map((item) => (
              <React.Fragment key={item.code}>
                <span
                  aria-hidden="true"
                  className={_class(item.name, value)}
                  onClick={() => handleClick(item)}
                >
                  {item.name}
                </span>
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CityDropdowns.propTypes = {
  defaultValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

CityDropdowns.defaultProps = {
  defaultValue: undefined,
};

export default CityDropdowns;
