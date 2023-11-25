import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
} from '@mui/material';

const StocksTable = ({ companies, getData, changeListTrading}) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Участие в торгах</TableCell>
                        <TableCell>Аббревиатура</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>График</TableCell>
                        <TableCell>Таблица</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {companies.map((company) => (
                        <TableRow key={company.id}>
                            <TableCell>
                                <input className='trading_target_button' type="checkbox" value={company.id} onChange={changeListTrading}/>
                            </TableCell>
                            <TableCell>{company.id}</TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => getData(company.id, 'graphic')}>
                                    Показать
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => getData(company.id, 'table')}>
                                    Показать
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StocksTable;