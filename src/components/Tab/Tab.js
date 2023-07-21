import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
    const { children, value, index,  style, ...other} = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={style}
        {...other}
        >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

export default TabPanel;
  
//   TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };
  

//   export default function TabComponent({handleChange, tabActive}) {
//     const [value, setValue] = React.useState(0);
  
//     // const handleChange = (event, newValue) => {
//     //   setValue(newValue);
//     // };

//     // function tabActive(index) {
//     //     return {
//     //       id: `simple-tab-${index}`,
//     //       'aria-controls': `simple-tabpanel-${index}`,
//     //     };
//     //   }
      
//     return (
//       <Box sx={{ width: '100%' }}>
//         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//           <Tabs value={value} onChange={handleChange()}>
//             <Tab label="รายละเอียด" {...tabActive()} />
//             <Tab label="ราคา" {...tabActive(1)} />
//             <Tab label="Item Three" {...tabActive(2)} />
//           </Tabs>
//         </Box>
//         <TabPanel value={value} index={0}>
//            {<Test />}
//         </TabPanel>
//         <TabPanel value={value} index={0}>
//           Item Two
//         </TabPanel>
//         <TabPanel value={value} index={2}>
//           Item Three
//         </TabPanel>
//       </Box>
//     );
//   }