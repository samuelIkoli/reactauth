import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { local_url, AuthContext } from "..";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnterOTP = (props) => {
  const log = useContext(AuthContext);
  const navigate = useNavigate();
  const [QR, setQR] = useState([]);
  const [OTP, setOTP] = useState("");
  const [success, setSuccess] = useState(0);

  const handleOTP = async () => {
    if (!OTP || OTP.length < 6) {
      return alert("OTP has to be 6 digits");
    }
    const user_id = props.user.id;
    const user = props.user;
    const user_data = {
      otp: OTP,
      user_id,
    };
    try {
      const response = await axios.post(`${local_url}verify`, user_data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setSuccess(1);
        localStorage.setItem("username", user.username);
        localStorage.setItem("two_fa", user.two_fa);
        localStorage.setItem("token", user.token);
        localStorage.setItem("user_id", user_id);
        log.setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(error.response.data.message);
      } else {
        console.error("Error message:", error.message);
      }
    }
    return;
  };

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            2 Factor Authentication
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h4>Enter the OTP generated by your app</h4>
          </div>
          <div className="text-center" size={6}>
            <input
              type="number"
              onChange={(e) => {
                setOTP(e.target.value);
              }}
            />
            <button
              type="button"
              className="btn btn-primary mx-5"
              onClick={handleOTP}
            >
              Validate
            </button>
          </div>
          {/* <p></p> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnterOTP;
