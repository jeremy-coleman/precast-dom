
import { Component, h } from 'preact';

export class Logo extends Component {

    render() {
        return (
            <div className='flex-parent-centered transparent-for-clicks'>
                <div className='logo'>
                    <div className='logo-title'>Raycast demo</div>
                    <div className='logo-subtitle'>[ touch the screen ]</div>
                </div>
            </div>
        );
    }
}