import React from 'react';
import './Buttons.scss';

import GuideIcon from '../../static/images/guides-icon.png';
import ApiReferenceIcon from '../../static/images/api-ref.png';
import SupportIcon from '../../static/images/support.png';

const Buttons = () => (
  <div className="buttons-container">
    <div className="buttons-row">
      <div className="buttons-column">
        <div className="buttons-background-fill">
          <div className="landing-button-container">
            <div className="landing-button">
              <div className="relative-container">
                <img src={GuideIcon} role="presentation" />
                <h2>Guides</h2>
                <p className="linkText">
                  View the guides
                </p>
                <div className="landing-button-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttons-column">
        <div className="buttons-background-fill">
          <div className="landing-button-container">
            <div className="landing-button">
              <div className="relative-container">
                <img src={ApiReferenceIcon} role="presentation" />
                <h2>API Reference</h2>
                <p className="linkText">
                  View the API Reference
                </p>
                <div className="landing-button-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttons-column">
        <div className="buttons-background-fill">
          <div className="landing-button-container">
            <div className="landing-button">
              <div className="relative-container">
                <img src={SupportIcon} role="presentation" />
                <h2>Support</h2>
                <p className="linkText">
                  Get support
                </p>
                <div className="landing-button-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Buttons;
