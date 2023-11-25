import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketIo, useConnectSocket } from "../../socket/socket-io.jsx";
import "./Trading.css";
import ToolBar from "../tool-bar/tool-bar.jsx";
import {
    Box, Button,
    Container,
    InputLabel,
    Stack,
    TextField,
    Typography
} from "@mui/material";

export const StocksTrading = () => {
    const listTradings = useSelector(state => state.tradingList)
    const [stocks, setStocks] = useState([])
    const [trading, setTrading] = useState([])
    const [speed, setSpeed] = useState(0)
    const [date, setDate] = useState('')
    const [change, setChange] = useState(0)
    const [start, setStart] = useState(false)

    const setSpeedChange = (event) => {
        setSpeed(event.target.value)
    }

    const setDateChange = (event) => {
        setDate(event.target.value);
    }

    useConnectSocket();

    useEffect(() => {
        SocketIo.socket.on("trading", (data) => {
            setChange(JSON.parse(data));
        })
    }, []);

    useEffect(() => {
        clickStop();
        (async () => {
            const data = await fetch('http://localhost:8080/stocks').then(res => res.json());
            setStocks(data);

            let tr = []
            listTradings.forEach((elem) => {
                const index = data.map((dataElem) => {
                    return dataElem.id;
                }).indexOf(elem);
                if (index > -1) {
                    tr.push({id: data[index].id, name: data[index].name, prices: data[index].data.reverse()})
                }
            })
            setTrading(tr);
        })()
    }, [])

    const clickStart = () => {
        setStart(true)
        if (speed > 0 && date && trading){
            SocketIo.socket.emit("tradingDone", {listTradings})

            let index = -1;
            for (let i = 0; i < trading[0].prices.length; i++){
                if (new Date(trading[0].prices[i].Date).toDateString() === new Date(date).toDateString()){
                    console.log(new Date(trading[0].prices[i].Date).toDateString(), new Date(date).toDateString())
                    index = i;
                    break;
                }
            }
            SocketIo.socket.emit("startTrading", {index, speed})
        }
    }

    const clickStop = () => {
        SocketIo.socket.emit("stopTrading")
        setStart(false)
    }

    if (stocks?.length) {
        if (!trading[0]?.prices[change]) {
            clickStop();
            window.location = 'http://localhost:5173/stocks';
            return (
                <>
                    <ToolBar />
                    <Container>
                        <Typography variant="h2">Загрузка данных...</Typography>
                    </Container>
                </>
            );
        }

        return (
            <>
                <ToolBar />
                <Container sx={{ mt: 2 }}>
                    <Box className="trading_container">
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center" spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <Stack direction="column" alignItems="center" spacing={2}>
                                <InputLabel htmlFor="date">Дата начала</InputLabel>
                                <TextField
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={setDateChange}
                                    sx={{ width: '200px' }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min:
                                            trading && trading.length > 0
                                                ? new Date(Math.max(...trading.map((item) =>
                                                    new Date(Math.min(...item.prices.map((price) =>
                                                        new Date(price.Date))))))).toISOString().split('T')[0]
                                                : '',
                                        max:
                                            trading && trading.length > 0
                                                ? new Date(Math.min(...trading.map((item) =>
                                                    new Date(Math.max(...item.prices.map((price) =>
                                                        new Date(price.Date))))))).toISOString().split('T')[0]
                                                : '',
                                    }}
                                />
                            </Stack>
                            <Stack direction="column" alignItems="center" spacing={2}>
                                <InputLabel htmlFor="speed">Скорость</InputLabel>
                                <TextField
                                    id="speed"
                                    type="number"
                                    value={speed}
                                    onChange={setSpeedChange}
                                    sx={{ width: '200px' }}
                                    inputProps={{ min: 0 }}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" color="primary" onClick={clickStart}>
                                    Старт
                                </Button>
                                <Button variant="contained" color="error" onClick={clickStop}>
                                    Стоп
                                </Button>
                            </Stack>
                        </Stack>
                        <Box className="scrollable_trading"
                             sx={{
                                 maxHeight: '80vh',
                                 overflowY: 'scroll',
                                 bgcolor: '#e8eafd',
                                 color: 'white',
                                 fontSize: '18px',
                                 padding: '10px',
                                 borderRadius: '10px' }}
                        >
                            {change > 0 && date && speed && start ? (
                                trading.map((trad) => (
                                    <Box
                                        key={trad.id}
                                        className="trading_elem"
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 33%)',
                                            padding: '10px',
                                            borderBottom: '2px solid #000' }}
                                    >
                                        <Typography variant="body1" className="trading_info">
                                            {trad.name}
                                        </Typography>
                                        <Typography variant="body1" className="trading_info">
                                            {trad.prices[change]?.Open}
                                        </Typography>
                                        <Typography variant="body1" className="trading_info">
                                            {trad.prices[change]?.Date}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Box></Box>
                            )}
                        </Box>
                    </Box>
                </Container>
            </>
        );
    }
}

export default StocksTrading;