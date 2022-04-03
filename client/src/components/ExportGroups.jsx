import * as React from 'react';
import { Button } from '@mui/material';
import CsvDownload from 'react-json-to-csv'
import { useGetProjectGroupsQuery } from '../services/project';

export const ExportGroups = ({ project_id, sectionid, projectname }) => {

    const { data: isIn } = useGetProjectGroupsQuery({ "id": project_id, "course_id": sectionid }, {
        skip: (project_id && sectionid) ? false : true,
    });


    return (
        <>
            {isIn &&
                <CsvDownload
                    data={isIn}
                    filename={sectionid + "_" + projectname + '.csv'}
                    style={{
                        backgroundColor: "#0a3b5b",
                        borderRadius: "6px",
                        border: "1px solid #a511c0",
                        display: "inline-block",
                        cursor: "pointer", "color": "#ffffff",
                        fontSize: "15px",
                        padding: "6px 24px",
                        textDecoration: "none",
                        textShadow: "0px 1px 0px #9b14b3"
                    }}
                >
                    Export Groups
                </CsvDownload>
            }
        </>
    );
}

export default ExportGroups;