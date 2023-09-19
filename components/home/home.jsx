import React from 'react';
import './style.css'

const RightSection = () => {
  const reminders = [
    {
      icon: 'volume_up',
      title: 'Workshop',
      time: '08:00 AM - 12:00 PM',
      active: true,
    },
    {
      icon: 'edit',
      title: 'Workshop',
      time: '08:00 AM - 12:00 PM',
      active: false,
    },
  ];

  return (
    <div className="right-section">
      <div className="nav">
        <button id="menu-btn">
          <span className="material-icons-sharp">menu</span>
        </button>
        {/* You can leave any other elements or components here */}
      </div>

      

      <div className="reminders">
        <div className="header">
          <h2>Reminders</h2>
        </div>

        {reminders.map((reminder, index) => (
          <div className={`notification ${reminder.active ? '' : 'deactive'}`} key={index}>
            <div className="icon">
              <span className={`material-icons-sharp`}>{reminder.icon}</span>
            </div>
            <div className="content">
              <div className="info">
                <h3>{reminder.title}</h3>
                <small className="text_muted">{reminder.time}</small>
              </div>
              <span className="material-icons-sharp">more_vert</span>
            </div>
          </div>
        ))}

        <div className="notification add-reminder">
          <div>
            <span className="material-icons-sharp">add</span>
            <h3>Add Reminder</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
