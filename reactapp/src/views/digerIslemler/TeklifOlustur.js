import { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Autocomplete, Box, Button, IconButton, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();

    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [urunAdi, setUrunAdi] = useState('');
    const [urunId, setUrunId] = useState('');
    const [teklifDegeri, setTeklifDegeri] = useState('');
    const [musteriId, setMusteriId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [offer, setOffer] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [teklifSuresi, setTeklifSuresi] = useState('');
    const [teklifSuresiError, setTeklifSuresiError] = useState(false);
    const [iskontoOrani, setIskontoOrani] = useState('');
    const [iskontoOraniError, setIskontoOraniError] = useState(false);
    const [eklenenUrunler, setEklenenUrunler] = useState([]);
    const [firstRowSelection, setFirstRowSelection] = useState({});
    const [secondRowSelection, setSecondRowSelection] = useState({});
    const [toplamKdvFiyat, setToplamKdvFiyat] = useState();

    const [paraBirimi, setParaBirimi] = useState('');
    const [fiyat, setFiyat] = useState(0);
    const [adet, setAdet] = useState(1);

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

    const { data, isError, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['table-data'],
        queryFn: async () => {
            var responseData;
            const FormData = require('form-data');
            let data = new FormData();
            data.append('pageSize', 0);
            data.append('pageIndex', 0);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/GetGrid',
                data: data
            };

            await axios
                .request(config)
                .then((response) => {
                    responseData = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
            return responseData;
        },
        keepPreviousData: true
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'adi',
                header: 'Ürün Adı'
            },
            {
                accessorKey: 'aciklama',
                header: 'Açıklama'
            },
            {
                accessorKey: 'ebat',
                header: 'Ebat'
            },
            {
                accessorKey: 'fiyat',
                header: 'Fiyat',
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue()?.toLocaleString?.('tr-TR', {
                            style: 'currency',
                            currency: cell.row.original.paraBirimi,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        })}
                    </>
                )
            },
            // {
            //     accessorKey: 'paraBirimi',
            //     header: 'Para Birimi'
            // },
            {
                accessorKey: 'tedarikci',
                header: 'Tedarikçi Firma'
            },
            {
                accessorKey: 'kdv',
                header: 'KDV Oranı (%)'
            },
            {
                accessorKey: 'kategori',
                header: 'Kategori'
            },
            {
                accessorKey: 'urunSahibi',
                header: 'Ürün Sahibi'
            }
        ],
        []
    );

    const calculateFiyatFooterValues = () => {
        let toplamTRY = 0;
        let toplamUSD = 0;
        let toplamEUR = 0;

        eklenenUrunler.forEach((urun) => {
            const fiyat = parseFloat(urun.fiyat);
            if (urun.paraBirimi === 'TRY') {
                toplamTRY += fiyat;
            } else if (urun.paraBirimi === 'USD') {
                toplamUSD += fiyat;
            } else if (urun.paraBirimi === 'EUR') {
                toplamEUR += fiyat;
            }
        });

        return {
            toplamTRY,
            toplamUSD,
            toplamEUR
        };
    };

    const calculateKdvFiyatFooterValues = () => {
        let toplamKdvTRY = 0;
        let toplamKdvUSD = 0;
        let toplamKdvEUR = 0;

        eklenenUrunler.forEach((urun) => {
            const fiyat = parseFloat(urun.fiyat);
            const kdv = parseInt(urun.kdv);
            const adet = parseInt(urun.adet);
            if (urun.paraBirimi === 'TRY') {
                toplamKdvTRY += (fiyat + (fiyat * kdv) / 100) * adet;
            } else if (urun.paraBirimi === 'USD') {
                toplamKdvUSD += (fiyat + (fiyat * kdv) / 100) * adet;
            } else if (urun.paraBirimi === 'EUR') {
                toplamKdvEUR += (fiyat + (fiyat * kdv) / 100) * adet;
            }
        });

        return {
            toplamKdvTRY,
            toplamKdvUSD,
            toplamKdvEUR
        };
    };

    const selectedColumns = useMemo(
        () => [
            {
                accessorKey: 'adi',
                header: 'Ürün Adı',
                enableEditing: false
            },
            {
                accessorKey: 'fiyat',
                header: 'Fiyat',
                muiTableBodyCellEditTextFieldProps: {
                    required: true,
                    type: 'number',
                    inputProps: {
                        min: 0
                    }
                },
                // aggregationFn: 'sum',
                // AggregatedCell: ({ cell }) => <Box sx={{ color: 'warning.main' }}>{cell.getValue()}</Box>,
                Footer: () => {
                    const { toplamTRY, toplamUSD, toplamEUR } = calculateFiyatFooterValues();
                    return (
                        <>
                            <div>Toplam</div>
                            {toplamTRY !== 0 && (
                                <div>
                                    {toplamTRY.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                            {toplamUSD !== 0 && (
                                <div>
                                    {toplamUSD.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                            {toplamEUR !== 0 && (
                                <div>
                                    {toplamEUR.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                        </>
                    );
                }
            },
            {
                accessorKey: 'paraBirimi',
                header: 'Para Birimi',
                Edit: ({ cell }) => (
                    <Select
                        defaultValue={cell.row.original.paraBirimi}
                        variant="standard"
                        onChange={(e) => handleSaveCell(cell, e.target.value)}
                    >
                        {paraBirimleri.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </Select>

                    // <TextField
                    //     required
                    //     select
                    //     defaultValue={cell.row.original.paraBirimi}
                    //     variant="standard"
                    //     onChange={(e) => handleSaveCell(cell, e.target.value)}
                    // >
                    //     {paraBirimleri.map((p) => (
                    //         <MenuItem key={p.value} value={p.value}>
                    //             {p.label}
                    //         </MenuItem>
                    //     ))}
                    // </TextField>
                )
            },
            {
                accessorKey: 'adet',
                header: 'Adet',
                muiTableBodyCellEditTextFieldProps: {
                    required: true,
                    type: 'number',
                    // defaultValue: 1,
                    inputProps: {
                        min: 0
                    }
                }
            },
            {
                accessorKey: 'kdv',
                header: 'KDV Oranı (%)',
                enableEditing: false
            },
            {
                accessorKey: 'kategori',
                header: 'Kategori',
                enableEditing: false
            },
            {
                accessorKey: 'kdvDahilFiyat',
                header: 'KDV Dahil Fiyat',
                enableEditing: false,
                Cell: ({ cell }) => {
                    const urun = eklenenUrunler.find((urun) => urun.id === cell.row.id);
                    if (urun) {
                        const fiyat = parseFloat(urun.fiyat);
                        const kdv = parseFloat(urun.kdv);
                        const adet = parseInt(urun.adet);
                        const kdvDahilFiyat = (fiyat + (fiyat * kdv) / 100) * adet;
                        return (
                            <>
                                {kdvDahilFiyat.toLocaleString('tr-TR', {
                                    style: 'currency',
                                    currency: cell.row.original.paraBirimi,
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2
                                })}
                            </>
                        );
                    } else {
                        return <div>###</div>;
                    }
                    // const fiyat = parseFloat(cell.row.original.fiyat);
                    // const kdv = parseFloat(cell.row.original.kdv);
                    // const kdvDahilFiyat = fiyat + (fiyat * kdv) / 100;
                    // return (
                    //     <>
                    //         {kdvDahilFiyat.toLocaleString('tr-TR', {
                    //             style: 'currency',
                    //             currency: cell.row.original.paraBirimi,
                    //             minimumFractionDigits: 0,
                    //             maximumFractionDigits: 2
                    //         })}
                    //     </>
                    // );
                },
                Footer: () => {
                    const { toplamKdvTRY, toplamKdvUSD, toplamKdvEUR } = calculateKdvFiyatFooterValues();
                    return (
                        <>
                            <div>Toplam</div>
                            {toplamKdvTRY !== 0 && (
                                <div>
                                    {toplamKdvTRY.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                            {toplamKdvUSD !== 0 && (
                                <div>
                                    {toplamKdvUSD.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                            {toplamKdvEUR !== 0 && (
                                <div>
                                    {toplamKdvEUR.toLocaleString('tr-TR', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            )}
                        </>
                    );
                }
            }
        ],
        [eklenenUrunler]
    );

    const handleEkleClick = () => {
        const selectedItems = Object.keys(firstRowSelection);

        // Eklenen ürünleri kontrol et ve sadece yeni olanları eklemek için filtrele
        const newSelectedItems = selectedItems.filter(
            (itemId) => !eklenenUrunler.some((eklenenUrun) => eklenenUrun.id === parseInt(itemId))
        );

        if (newSelectedItems.length === 0) {
            alert('Seçili ürünler zaten eklenmiş.');
            return;
        }

        const newEklenenUrunler = newSelectedItems.map((itemId) => {
            const selectedUrun = data.list.find((item) => item.id === parseInt(itemId));
            return {
                ...selectedUrun,
                adet: 1 // Varsayılan olarak 1 adet ekliyoruz
            };
        });

        setEklenenUrunler((prevEklenenUrunler) => [...prevEklenenUrunler, ...newEklenenUrunler]);

        // Seçili öğeleri sıfırla
        setFirstRowSelection({});
    };

    const handleSaveCell = (cell, value) => {
        eklenenUrunler.map((urun) => {
            if (cell.row.id === urun.id) {
                if (cell.column.id == 'fiyat') {
                    urun.fiyat = parseFloat(value);
                } else if (cell.column.id == 'adet') {
                    urun.adet = parseInt(value);
                } else if (cell.column.id == 'paraBirimi') {
                    urun.paraBirimi = value;
                }
            }
        });
    };

    const teklifOlustur = () => {
        if (eklenenUrunler.length === 0) {
            alert('Lütfen en az bir ürün ekleyin.');
            return;
        }

        if (!teklifSuresi) {
            setTeklifSuresiError(true);
            return;
        }

        if (!iskontoOrani) {
            setIskontoOrani(true);
            return;
        }

        toast.promise(teklifOlusturPromise, {
            pending: 'Teklif oluşturuluyor',
            success: 'Teklif başarıyla oluşturuldu 👌',
            error: 'Teklif oluşturulurken hata oluştu 🤯'
        });
    };

    const teklifOlusturPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});

            let toplamFiyatTRY = 0;
            let toplamFiyatUSD = 0;
            let toplamFiyatEUR = 0;
            eklenenUrunler.map((urun) => {
                if (urun.paraBirimi == 'TRY') {
                    toplamFiyatTRY += (urun.fiyat + (urun.fiyat * urun.kdv) / 100) * urun.adet;
                } else if (urun.paraBirimi == 'USD') {
                    toplamFiyatUSD += (urun.fiyat + (urun.fiyat * urun.kdv) / 100) * urun.adet;
                } else if (urun.paraBirimi == 'EUR') {
                    toplamFiyatEUR += (urun.fiyat + (urun.fiyat * urun.kdv) / 100) * urun.adet;
                }
                // toplamFiyat += (urun.fiyat + (urun.fiyat * urun.kdv) / 100) * urun.adet;
            });

            let data = JSON.stringify({
                teklifSuresi: teklifSuresi,
                iskontoOrani: iskontoOrani,
                toplamFiyatTRY: toplamFiyatTRY,
                toplamFiyatUSD: toplamFiyatUSD,
                toplamFiyatEUR: toplamFiyatEUR,
                teklifItems: eklenenUrunler.map((urun) => {
                    return {
                        urunId: urun.id,
                        adet: urun.adet || 1,
                        birimFiyat: urun.fiyat,
                        paraBirimi: urun.paraBirimi
                    };
                })
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Teklif/Create',
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

    return (
        <>
            <h5>Teklif Ver</h5>
            <MaterialReactTable
                muiTablePaperProps={{ sx: { marginBottom: '24px' } }}
                enableRowSelection={(row) => !eklenenUrunler.some((eklenenUrun) => eklenenUrun.id === row.id)}
                getRowId={(row) => row.id}
                onRowSelectionChange={setFirstRowSelection}
                muiTableBodyRowProps={({ row }) => ({
                    onClick: row.getToggleSelectedHandler(),
                    sx: { cursor: 'pointer' }
                })}
                columns={columns}
                data={data !== undefined ? data.list : []}
                /*muiToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data'
                        }
                        : undefined
                }*/
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                renderTopToolbarCustomActions={() => (
                    <Tooltip arrow title="Refresh Data">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                )}
                renderBottomToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={handleEkleClick}
                        variant="contained"
                        disabled={Object.keys(firstRowSelection).length === 0}
                    >
                        Ekle
                    </Button>
                )}
                rowCount={data?.dataCount ?? 0}
                state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    sorting,
                    rowSelection: firstRowSelection
                }}
            />

            {eklenenUrunler.length > 0 && (
                <>
                    <h5>Eklenen Ürünler</h5>
                    <MaterialReactTable
                        muiTablePaperProps={{ sx: { marginBottom: '24px' } }}
                        enableEditing
                        editingMode="table"
                        muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                            onBlur: (event) => {
                                handleSaveCell(cell, event.target.value);
                            }
                        })}
                        enableGrouping
                        initialState={{
                            grouping: ['kategori'],
                            expanded: true
                        }}
                        enableRowSelection
                        getRowId={(row) => row.id}
                        onRowSelectionChange={setSecondRowSelection}
                        columns={selectedColumns}
                        data={eklenenUrunler}
                        /*muiToolbarAlertBannerProps={
                            isError
                                ? {
                                    color: 'error',
                                    children: 'Error loading data'
                                }
                                : undefined
                        }*/
                        onColumnFiltersChange={setColumnFilters}
                        onGlobalFilterChange={setGlobalFilter}
                        onPaginationChange={setPagination}
                        onSortingChange={setSorting}
                        renderTopToolbarCustomActions={() => (
                            <Button
                                color="error"
                                onClick={() => {
                                    const selectedIds = Object.keys(secondRowSelection);
                                    const updatedEklenenUrunler = eklenenUrunler.filter(
                                        (item) => !selectedIds.includes(item.id.toString())
                                    );
                                    setEklenenUrunler(updatedEklenenUrunler);
                                    setSecondRowSelection({});
                                }}
                                variant="contained"
                                disabled={Object.keys(secondRowSelection).length === 0}
                            >
                                Sil
                            </Button>
                        )}
                        // renderBottomToolbarCustomActions={() => (
                        //     <Button color="secondary" onClick={teklifOlustur} variant="contained">
                        //         Kaydet
                        //     </Button>
                        // )}
                        rowCount={data?.dataCount ?? 0}
                        state={{
                            columnFilters,
                            globalFilter,
                            isLoading,
                            pagination,
                            showAlertBanner: isError,
                            showProgressBars: isFetching,
                            sorting,
                            rowSelection: secondRowSelection
                        }}
                    />
                    <TextField
                        required
                        id="teklifSuresi"
                        label="Teklif Süresi"
                        type="number"
                        value={teklifSuresi}
                        onChange={(e) => {
                            setTeklifSuresi(e.target.value);
                            setTeklifSuresiError(false);
                        }}
                        className="mb-3 me-3"
                        inputProps={{ min: 1 }}
                        error={teklifSuresiError}
                        helperText={teklifSuresiError ? 'Teklif süresi boş bırakılamaz.' : 'Teklifin kaç gün geçerli olacağıni giriniz'}
                    />
                    <TextField
                        required
                        id="iskontoOranı"
                        label="İskonto Oranı"
                        type="number"
                        value={iskontoOrani}
                        onChange={(e) => {
                            setIskontoOrani(e.target.value);
                            setIskontoOraniError(false);
                        }}
                        className="mb-3"
                        inputProps={{ min: 0 }}
                        error={iskontoOraniError}
                        helperText={iskontoOraniError && 'Teklif süresi boş bırakılamaz.'}
                    />
                    <div></div>
                    <Button color="secondary" onClick={teklifOlustur} variant="contained">
                        Kaydet
                    </Button>
                </>
            )}
        </>
    );
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
    <QueryClientProvider client={queryClient}>
        <Example />
    </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
