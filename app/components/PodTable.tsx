import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import { V1Pod } from '@kubernetes/client-node/dist/gen/model/models';
import moment from 'moment';
import FullScreenDialog from './PodPopup';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
const { ipcRenderer } = require('electron');

interface Data {
  namespace: string;
  age: string;
  containers: string;
  name: string;
  state: string;
  pod: V1Pod;
}

function createData(
  name: string,
  namespace: string,
  containers: string,
  age: string,
  state: string,
  pod: V1Pod
): Data {
  return { name, namespace, containers, age, state, pod };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | V1Pod },
  b: { [key in Key]: number | string | V1Pod }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  {
    id: 'namespace',
    numeric: false,
    disablePadding: false,
    label: 'Namespace',
  },
  {
    id: 'containers',
    numeric: false,
    disablePadding: false,
    label: 'Containers',
  },
  { id: 'age', numeric: false, disablePadding: false, label: 'Age' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
];

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  })
)(TableRow);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      // margin:"0px",
      paddingTop: '0px',
      paddingBottom: '0px',
      // fontSize: "1.26563em",
      // lineHeight: "1.5",
      border: '0px',
      // paddingRight: 4,
      // paddingLeft: 5,
      // maxHeight:10,
    },
    head: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    body: {
      // fontSize: "1.26563em",
    },
  })
)(TableCell);

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const classesstyle = useToolbarStyles();
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox" className={classesstyle.head}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            className={classesstyle.head}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.main,
    },
    icons: {
      color: theme.palette.text.primary,
    },
    root: {
      backgroundColor: theme.palette.background.default,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      color: theme.palette.background.default,
      display: 'flex',
      justifyContent: 'space-between',
    },
    text: {
      color: theme.palette.primary.main,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.background.default,
          }
        : {
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.background.default,
          },
    title: {
      flex: '1 1 100%',
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        className={classes.text}
      >
        <h2>Resources</h2>
        <h2>Pods</h2>
      </Breadcrumbs>

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" className={classes.icons}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div></div>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    name: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
    pagination: {
      backgroundColor: theme.palette.background.default,
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      // minWidth: 500,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

const containerStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
    },
    green: {
      backgroundColor: '#a3be8c',
      width: '15px',
      height: '15px',
      borderRadius: '5px',
      marginRight: '5px',
    },
    orange: {
      backgroundColor: '#d08770',
      width: '15px',
      height: '15px',
      borderRadius: '5px',
      marginRight: '5px',
    },
    red: {
      backgroundColor: '#bf616a',
      width: '15px',
      height: '15px',
      borderRadius: '5px',
      marginRight: '5px',
    },
    greentext: {
      color: '#a3be8c',
    },
    orangetext: {
      color: '#d08770',
    },
    redtext: {
      color: '#bf616a',
    },
  })
);

type containerprop = {
  pod: V1Pod;
  index: number;
};
function RenderContainers({ pod, index }: containerprop) {
  if (
    pod === undefined ||
    pod.status === undefined ||
    pod.status.containerStatuses === undefined
  )
    return <div></div>;
  const classes = containerStyles();
  return (
    <div className={classes.root}>
      {pod.status.containerStatuses.map(function (status, nb) {
        if (status === undefined || status.state === undefined) return <div />;

        if (status.state.running != undefined && pod.status != undefined)
          return (
            <Paper
              elevation={1}
              key={pod.status.reason + index.toString() + nb.toString()}
              className={classes.green}
            />
          );
        if (
          status.state.waiting != undefined &&
          status.state.waiting.message != undefined &&
          pod.status != undefined
        )
          return (
            <Tooltip title={status.state.waiting.message} aria-label="add">
              <Paper
                elevation={1}
                key={pod.status.reason + index.toString() + nb.toString()}
                className={classes.orange}
              />
            </Tooltip>
          );
        if (
          status.state.terminated != undefined &&
          status.state.terminated.message != undefined &&
          pod.status != undefined
        )
          return (
            <Tooltip title={status.state.terminated.message} aria-label="add">
              <Paper
                elevation={1}
                key={pod.status.reason + index.toString() + nb.toString()}
                className={classes.red}
              />
            </Tooltip>
          );
        return <div />;
      })}
    </div>
  );
}
function RenderStatus({ pod, index }: containerprop) {
  const classes = containerStyles();
  if (pod.status === undefined || pod.status.containerStatuses === undefined)
    return <div />;
  var st = pod.status.containerStatuses[0].state;
  if (st === undefined) return <div />;
  if (st.running != undefined)
    return (
      <p key={'running' + index.toString()} className={classes.greentext}>
        Running
      </p>
    );
  if (st.waiting != undefined)
    return (
      <p key={'waiting' + index.toString()} className={classes.orangetext}>
        {st.waiting.reason}
      </p>
    );
  if (st.terminated != undefined)
    return (
      <p key={'terminated' + index.toString()} className={classes.redtext}>
        {st.terminated.reason}
      </p>
    );
  return <div />;
}

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('namespace');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [curentpod, setCurentpod] = React.useState<V1Pod>();
  const [namespaces, setNamespaces] = React.useState(['default']);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (pod: V1Pod) => {
    setCurentpod(pod);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    var pods = ipcRenderer.sendSync('getPods');
    updatePods(pods);
    const interval = setInterval(() => {
      var pods = ipcRenderer.sendSync('getPods');
      updatePods(pods);
    }, 1000);
    return () => clearInterval(interval);
  }, [namespaces]);

  const getPodStatus = (pod?: V1Pod) => {
    if (
      pod === undefined ||
      pod.status === undefined ||
      pod.status.containerStatuses === undefined
    )
      return;
    if (pod.status.containerStatuses[0].state === undefined) return;
    var state = pod.status.containerStatuses[0].state!;
    if (state.waiting != undefined) {
      return state.waiting.reason!;
    } else if (state.terminated != undefined) {
      return state.terminated.reason!;
    } else {
      return 'Running';
    }
  };

  moment.fn.fromNow = function () {
    var duration = moment().diff(this, 'seconds');
    var minutes = duration / 60;
    var hours = minutes / 60;
    var day = hours / 24;
    if (day > 1) return Math.floor(day).toString() + 'd';
    if (hours > 1) return Math.floor(hours).toString() + 'h';
    if (minutes > 1) return Math.floor(minutes).toString() + 'm';
    return duration + 's';
  };

  const updatePods = (pods: V1Pod[]) => {
    var newRow: Data[] = [];
    pods.map(function (pod) {
      if (
        pod === undefined ||
        pod.metadata === undefined ||
        pod.metadata.name === undefined
      )
        return;
      var name: string = pod.metadata.name!;
      var namespace: string = pod.metadata.namespace!;
      var containers: string = pod.status?.containerStatuses?.length.toString()!;
      moment.relativeTimeThreshold('m', 60);
      moment.relativeTimeThreshold('h', 24 * 26);
      var age = moment(pod.status?.startTime!).fromNow();
      // alert(diff / (1000*60*60*24));     // positive number of days
      // var age: string = moment(pod.status?.startTime!).format("hh")
      var status: string = getPodStatus(pod!)!;
      newRow.push(createData(name, namespace, containers, age, status, pod));
    });
    setRows(newRow);
  };
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const shpod = (pod: V1Pod) => {
    // let params = new URLSearchParams();
    // params.append("name", name);
    // params.append("namespace", namespace);
    // var url = "/api/pod-shell?" + params.toString();
    //fetch(url)
    return true;
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  var name: string;
                  name = row.name.toString();
                  var pod = row.pod as V1Pod;
                  const isItemSelected = isSelected(name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    // <FullScreenDialog pod={row.pod}></FullScreenDialog>

                    <StyledTableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={name}
                      selected={isItemSelected}
                    >
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onClick={(event) => handleClick(event, name)}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        style={{ width: '400px' }}
                      >
                        <div
                          onClick={() => handleClickOpen(pod)}
                          className={classes.name}
                        >
                          {row.name}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.namespace}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <RenderContainers
                          pod={pod}
                          index={index}
                        ></RenderContainers>
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.age}</StyledTableCell>
                      <StyledTableCell align="left">
                        <RenderStatus pod={pod} index={index}></RenderStatus>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          className={classes.pagination}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FullScreenDialog
        pod={curentpod!}
        open={open}
        handleClose={handleClose}
      ></FullScreenDialog>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}
