import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

const libs = ['Material UI', 'Elemental UI', 'Grommet', 'Mui', 'Rebass'];

const MaterialEx = () => {
    return (
        <div>
            <AutoComplete
                floatingLabelText="Type somethings"
                fillter={AutoComplete.fuzzyFillter}
                dataSource={libs}
                maxSearchResults={3}
                menuStyle={{ background: '#fff' }}
            />
        </div>
    );
};

export default MaterialEx;