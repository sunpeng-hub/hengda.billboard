import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

const Title = () => {
  // const [banner, setBanner] = useState(0);

  // useEffect(() => {
  //   fetch('./api/banner/企业端-页头/')
  //     .then((res) => res.json())
  //     .then((res) => {
  //       if (res.message) {
  //         window.alert(res.message);
  //       } else {
  //         setBanner(res.content[0]);
  //       }
  //     });
  // }, []);

  return (
    <div className="row bg-white">
      <div className="col px-5 mt-2 mb-2">
        <img className="img-fluid pull-left logo" alt="" src="./lib/img/logo3.png" />
        <div className="col-1 header-right pull-right">
          <a
            href="#操作手册/注册"
            className="text-secondary"
            style={{ textDecoration: 'none' }}
            target="_blank"
          >
            操作手册
          </a>
        </div>
        <div className="col-1 header-right pull-right">
          <span className="text-secondary border-0 bg-transparent img-weixin">
            <FontAwesomeIcon icon={faQrcode} fixedWidth />
            小程序
            <p>
              <img className="" alt="" src="./lib/img/qrcode.jpg" />
            </p>
          </span>
        </div>
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
        {/* {banner !== 0 ? <img className="img-fluid ad" alt="" src={banner.data_url} /> : <></>} */}
      </div>
    </div>
  );
};

export default Title;
