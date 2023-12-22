import React, { useState } from 'react';
import { Container, Grid, FormControl, TextField, Button, LinearProgress, MenuItem, InputAdornment } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function UrunEkle(params) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [urunAdi, setUrunAdi] = useState('');
    const [urunAciklamasi, setUrunAciklamasi] = useState('');
    const [urunEbadi, setUrunEbadi] = useState('');
    const [urunFiyati, setUrunFiyati] = useState('');
    const [tedarikciFirma, setTedarikciFirma] = useState('');
    const [kdv, setKdv] = useState('');
    const [kategoriler, setKategoriler] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState('');
    const [paraBirimi, setParaBirimi] = useState('TRY');
    const [validationErrors, setValidationErrors] = useState({});

    const paraBirimleri = [
        {
            value: 'TRY',
            label: '₺'
        },
        {
            value: 'USD',
            label: '$'
        },
        {
            value: 'EUR',
            label: '€'
        }
    ];

    useEffect(() => {
        kategoriGetirPromise();
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            urunGetirPromise();
        } else {
            setUrunAdi('');
            setUrunAciklamasi('');
            setUrunEbadi('');
            setUrunFiyati('');
            setTedarikciFirma('');
            setKdv('');
            setSelectedKategori('');
            setParaBirimi('TRY');
            setIsFetching(false);
        }
    }, [id]);

    const urunEkle = () => {
        if (typeof id !== 'undefined') {
            toast.promise(urunEklePromise, {
                pending: 'Ürün güncelleniyor',
                success: urunAdi + ' başarıyla güncellendi 👌',
                error: urunAdi !== '' ? urunAdi + ' güncellenirken hata oluştu 🤯' : 'Ürün güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(urunEklePromise, {
                pending: 'Ürün kaydı yapılıyor',
                success: urunAdi + ' başarıyla eklendi 👌',
                error: urunAdi !== '' ? urunAdi + ' eklenirken hata oluştu 🤯' : 'Ürün eklenirken hata oluştu 🤯'
            });
        }
    };

    const urunEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                adi: urunAdi,
                aciklama: urunAciklamasi,
                ebat: urunEbadi,
                fiyat: urunFiyati,
                paraBirimi: paraBirimi,
                tedarikci: tedarikciFirma,
                kdv: kdv,
                kategori: selectedKategori
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/CreateOrUpdate',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                data: data
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 700) {
                            await sleep(700 - millis);
                        }
                        navigate(`/digerIslemler/urunler`);
                        resolve(response.data); // Başarılı sonuç durumunda Promise'ı çöz
                    } else {
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setValidationErrors(error.response.data.errors);
                    reject(error); // Hata durumunda Promise'ı reddet
                });
        });
    };

    const urunGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/Get',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                params: {
                    id: id
                }
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 500) {
                            await sleep(500 - millis);
                        }
                        setUrunAdi(response.data.data.adi);
                        setUrunAciklamasi(response.data.data.aciklama);
                        setUrunEbadi(response.data.data.ebat);
                        setUrunFiyati(response.data.data.fiyat);
                        setTedarikciFirma(response.data.data.tedarikci);
                        setKdv(response.data.data.kdv);
                        setSelectedKategori(response.data.data.kategori);
                        setParaBirimi(response.data.data.paraBirimi);
                        setFetchingError(false);
                        resolve(response.data); // Başarılı sonuç d1urumunda Promise'ı çöz
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    const kategoriGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Kategori/Get',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                }
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 500) {
                            await sleep(500 - millis);
                        }
                        setKategoriler(response.data.data);
                        setFetchingError(false);
                        resolve(response.data); // Başarılı sonuç d1urumunda Promise'ı çöz
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    return (
        <Container className="d-flex justify-content-center" maxWidth="md">
            <Grid item xs={6}>
                <FormControl sx={{ m: 0, width: '50ch' }}>
                    {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                    {(isUpdate === 0 || !isFetching) && (
                        <>
                            <TextField
                                required
                                margin="normal"
                                id="urunAdi"
                                label="Ürün Adı"
                                variant="outlined"
                                value={urunAdi}
                                onChange={(e) => setUrunAdi(e.target.value)}
                                error={!!validationErrors.dataVM} // Hatanın varlığına göre error özelliğini ayarla
                                helperText={validationErrors.dataVM && 'Ürün adı boş bırakılamaz.'} // Hata mesajını helperText olarak göster
                            />
                            <TextField
                                margin="normal"
                                id="urunAciklamasi"
                                label="Ürün Açıklaması"
                                variant="outlined"
                                value={urunAciklamasi}
                                onChange={(e) => setUrunAciklamasi(e.target.value)}
                                multiline
                                rows={4}
                            />
                            <TextField
                                margin="normal"
                                id="urunEbadi"
                                label="Ürün Ebadı"
                                variant="outlined"
                                value={urunEbadi}
                                onChange={(e) => setUrunEbadi(e.target.value)}
                            />
                            <TextField
                                required
                                margin="normal"
                                id="urunFiyati"
                                label="Ürün Fiyatı"
                                variant="outlined"
                                value={urunFiyati}
                                onChange={(e) => setUrunFiyati(e.target.value)}
                                error={!!validationErrors.dataVM}
                                helperText={validationErrors.dataVM && 'Ürün fiyatı boş bırakılamaz.'}
                                type="number"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TextField
                                                required
                                                id="standard-select-currency"
                                                select
                                                defaultValue="TRY"
                                                variant="standard"
                                                value={paraBirimi}
                                                onChange={(e) => setParaBirimi(e.target.value)}
                                            >
                                                {paraBirimleri.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                margin="normal"
                                id="tedarikciFirma"
                                label="Tedarikçi Firma"
                                variant="outlined"
                                value={tedarikciFirma}
                                onChange={(e) => setTedarikciFirma(e.target.value)}
                            />
                            <TextField
                                required
                                margin="normal"
                                id="kdvOrani"
                                label="KDV Oranı (%)"
                                variant="outlined"
                                value={kdv}
                                onChange={(e) => setKdv(e.target.value)}
                                error={!!validationErrors.dataVM}
                                helperText={validationErrors.dataVM && 'KDV oranı boş bırakılamaz.'}
                                type="number"
                            />
                            <TextField
                                required
                                margin="normal"
                                id="kategoriler"
                                select
                                label="Kategoriler"
                                value={selectedKategori}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                                error={!!validationErrors.dataVM}
                                helperText={validationErrors.dataVM && 'Kategori boş bırakılamaz.'}
                            >
                                <MenuItem disabled value="">
                                    <em>Seçiniz</em>
                                </MenuItem>
                                {kategoriler.map((kategori) => (
                                    <MenuItem key={kategori.id} value={kategori.id}>
                                        {kategori.adi}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button onClick={urunEkle} className="mb-2" margin="normal" variant="contained">
                                Kaydet
                            </Button>
                        </>
                    )}
                </FormControl>
            </Grid>
        </Container>
    );
}
export default UrunEkle;
