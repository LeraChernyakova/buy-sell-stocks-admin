import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import axios from 'axios';
import ToolBar from '../tool-bar/tool-bar.jsx';
import StocksTable from './stocks-table/stocks-table.jsx';
import { Chart } from 'chart.js/auto';
import './stock-list.css'
import {useDispatch, useSelector} from "react-redux";

const StocksList = () => {
    const [companies, setStocks] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [chooseCompany, setChooseCompany] = useState('');
    const [tableData, setTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showGraphic, setShowGraphic] = useState(false);
    const listTradings = useSelector(state => state.tradingList);
    const dispatch = useDispatch();
    const [isLoad, setLoad] = useState(false);

    const chartRef = useRef(null);

    const filterDataByYears = (data, years) => {
        return data.filter(item => {
            const itemYear = new Date(item.Date).getFullYear();
            return years.includes(itemYear);
        });
    };

    const getData = async (company, option) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/stocks`);
            const responseData = response.data.filter(item => item.id === company);
            const filteredData = filterDataByYears(responseData[0].data, [2022, 2023]);
            setChooseCompany(company)
            if (option === 'table') {
                setTableData(filteredData.map(entry => ({
                    Date: entry.Date,
                    Open: parseFloat(entry.Open),
                })));
                setShowTable(true);
                setShowGraphic(false)
            } else {
                setChartData(filteredData);
                setShowChart(true);
                setShowTable(false);
                setShowGraphic(true)
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoad){
            (async () => {
                const response = await axios.get(`http://localhost:8080/stocks`);
                setStocks(response.data);
                setLoad(true);
                dispatch({ type: "SAVE", tradingList: [] });
            })();
        }
    }, [])

    useEffect(() => {
        if (chartData.length > 0 && chartRef.current) {
            const parsedData = chartData.map((entry) => ({
                Date: entry.Date,
                Open: parseFloat(entry.Open),
            }));

            const labels = parsedData.map((entry) => entry.Date);
            const values = parsedData.map((entry) => entry.Open);

            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartRef.current.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: `Цена акций`,
                            data: values,
                            borderColor: '#1a25b4',
                            borderWidth: 2,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                        },
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [chartData]);

    const changeListTrading = (e) => {
        let updatedListTradings;

        if (e.target.checked) {
            updatedListTradings = [...listTradings, e.target.value];
        } else {
            updatedListTradings = listTradings.filter(item => item !== e.target.value);
        }
        dispatch({ type: "SAVE", tradingList: updatedListTradings });
    };

    return (
        <>
            <ToolBar />
            <Container sx={{ width: '100%', marginTop: 3 }}>
                <StocksTable companies={companies} getData={getData} changeListTrading={changeListTrading} />
            </Container>

            {loading && showGraphic ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : showChart && showGraphic ? (
                <Box
                    sx={{
                        mt: 10, // Изменено значение отступа сверху на 4px
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        p: 4,
                        width: '72%',
                        margin: '10px auto 0', // Исправлен синтаксис для центрирования и отступа сверху
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" component="div" gutterBottom>
                        График акций {chooseCompany}
                    </Typography>
                    <canvas ref={chartRef} width="1280" height="400" />
                </Box>
            ) : null}
            {tableData.length > 0 && showTable ? ( // Показывать таблицу только если есть данные
                <Box
                    sx={{
                        mt: 10, // Изменено значение отступа сверху на 4px
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        p: 4,
                        width: '72%',
                        margin: '10px auto 0', // Исправлен синтаксис для центрирования и отступа сверху
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" component="div" gutterBottom>
                        Таблица акций {chooseCompany}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Цена</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{entry.Date}</TableCell>
                                        <TableCell>{entry.Open}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : null}
        </>
    );
};

export default StocksList;
