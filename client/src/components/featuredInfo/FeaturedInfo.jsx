import { React } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteStudent } from "../../actions/student";
import { DeleteOutline } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import useStyles from './styles'

const FeaturedInfo = ({ setCurrentId }) => {
   const classes = useStyles()
   const dispatch = useDispatch();
   const student = useSelector((state) => state.student);
   const user = JSON.parse(localStorage.getItem('profile'));

   // const handleDelete = (id) => {
   //    setData(data.filter((item) => item.id !== id));
   // };

   // const handleDelete = (id) => {
   //    setData(data.filter((item) => item.id !== id));
   // };

   const columns = [
      { field: "_id", hide: true },
      { field: "creator", hide: true },
      { field: "studentID", headerName: "studentID", width: 90 },
      { field: "firstname", headerName: "First name", width: 200 },
      { field: "lastname", headerName: "Last name", width: 200 },
      { field: "email", headerName: "Email", width: 140, },
      {
         field: "action",
         headerName: "Action",
         width: 200,
         renderCell: (params) => {
            return (
               <div>
                  {(user?.result?._id === params.row.creator) ? (
                  <Link to={"/profile/" + params.row._id}>
                     <Button variant="contained" className={classes.userEdit} onClick={() => setCurrentId(params.row._id)}>Edit</Button>
                  </Link>
                  ):
                  <Link to={"/profile/" + params.row._id}>
                     <Button variant="contained" className={classes.userEdit} onClick={() => setCurrentId(params.row._id)}>View</Button>
                  </Link>
                  }
                  {(user?.result?._id === params.row.creator) && (
                     <DeleteOutline
                        className={classes.userDelete}
                        onClick={() => dispatch(deleteStudent(params.row._id))}
                     />
                  )}
               </div>
            );
         },
      },
   ];

   return (
      <Grid container maxWidth="lg" className={classes.container}>
         <Grid item xs={12}>
            <DataGrid
               getRowId={student => student._id}
               rows={student}
               columns={columns}
               pageSize={8}
               rowsPerPageOptions={[8]}
               disableSelectionOnClick
               checkboxSelection
            />
         </Grid>
      </Grid>
   );
}

export default FeaturedInfo;
