import React from 'react';

export const EXAMPLE_POPUP_ID = 'example-popup';
export const CLOSE_BUTTON_ID = 'cancel';

export const ExamplePopup = (props) => {
  return <div>
                <div className='popup-overlay'></div>
                <div className='flex-parent-centered'>
                    <div id={EXAMPLE_POPUP_ID} className='popup-dialog'>
                        <span className='popup-dialog-header'>Example popup</span>
                        <div className='popup-dialog-content'>
                            <p>This is the popup.</p>
                            <ul>
                                <li>Clicking outside this popup will close it.</li>
                                <li>Clicking inside will keep it open.</li>
                            </ul>
                            <p className='popup-dialog-content-quote'>[ with rays, it's easy to test an element against clicking outside ]</p>
                        </div>
                        <div className='popup-dialog-footer'>
                            <button className='toolbar-button' id={CLOSE_BUTTON_ID}><span className="fa fa-close"></span>&nbsp;&nbsp;Close</button>
                        </div>
                    </div>
                </div>
            </div>;
};