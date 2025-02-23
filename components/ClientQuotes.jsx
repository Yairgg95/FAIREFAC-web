import { useState, useEffect } from "react";
import QuoteTable from "@/components/QuoteTable";
import QuotesList from "@/components/QuotesList";
import { useRouter } from "next/router";
import { getQuoteByID, getStripeSession } from "@/pages/api/quote";
import { toast } from "sonner";
import SpinnerLoading from "./SpinnerLoading";

export default function ClientQuotes({ carListQuotes }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quotesReview, setQuotesReview] = useState([]);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const token = localStorage.getItem("token");

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const calculateTotals = (quoteDetails) => {
    let subtotal = 0;
    let iva = 0;

    quoteDetails.forEach((quote) => {
      quote.items?.forEach((item) => {
        subtotal += item.itemTotalPrice;
      });
    });

    iva = subtotal * 0.16;

    return { subtotal, iva };
  };

  const toggleDropdown = (quoteId) => {
    setOpenDropdownId((prevId) => (prevId === quoteId ? null : quoteId));
  };

  const openModal = (quote, index) => {
    setSelectedQuote(quote);
    setSelectedQuoteIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedQuote(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      const allCarsQuotes = [];
      const carQuoteItems = [];

      try {
        await Promise.all(
          carListQuotes?.map(async (car) => {
            const groupedQuotes = [];

            await Promise.all(
              car.quotes?.map(async (shopQuote) => {
                const repairShopQuote = await getQuoteByID(
                  shopQuote._id,
                  token
                );
                const quoteGroup = {
                  shopQuote: shopQuote._id,
                  fairRefacFee: 0,
                  totalWithFairRefacFee: 0,
                  repairShopQuoteID: repairShopQuote?.quote?._id,
                  quoteDetails: [],
                  items: [],
                };
                repairShopQuote?.quote?.repairShopQuotes
                  ?.filter((quote) => quote.status === "review")
                  .forEach((quote) => {
                    quoteGroup.quoteDetails.push(quote);
                    quoteGroup.fairRefacFee = repairShopQuote?.quote?.fee;
                    quoteGroup.totalWithFairRefacFee =
                      repairShopQuote?.quote?.totalFaiRefacFee;
                    quoteGroup.items = [...quoteGroup.items, ...quote.items];
                  });

                if (quoteGroup.quoteDetails.length > 0) {
                  groupedQuotes.push(quoteGroup);
                }
              })
            );

            if (groupedQuotes.length > 0) {
              allCarsQuotes.push({ car, carQuoteDetails: groupedQuotes });
            }
          })
        );

        setQuotesReview(allCarsQuotes);
      } catch (error) {
        toast.error("Error al obtener Info");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [carListQuotes, refreshToggle, router.isReady]);

  const triggerRefresh = () => setRefreshToggle((prev) => !prev);

  async function handlePayment(carQuoteId) {
    try {
      const response = await getStripeSession(carQuoteId, token);
      if (response.success) {
        router.push(response.data.session);
      } else {
        toast.error("Error al enviar a Session de Pago");
      }
    } catch (error) {
      toast.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="font-chakra font-bold text-[24px] mt-4 mb-4">
          COTIZACIONES A ELEGIR
        </h2>
        {loading && <SpinnerLoading />}
        {!loading &&
          quotesReview?.length > 0 &&
          quotesReview?.map(({ car, carQuoteDetails }, index) => (
            <div key={index}>
              {car.nickname !== "null" ? (
                <h2 className="font-chakra text-xl">
                  Cotizaciones para: <strong>{car?.nickname}</strong>
                </h2>
              ) : (
                <h2 className="font-chakra font-bold text-xl">
                  Cotizaciones para:{" "}
                  <strong>{`${car?.model} ${car?.brand} ${car?.version} ${car?.year}`}</strong>
                </h2>
              )}
              {carQuoteDetails?.map((quote) => {
                const { subtotal, iva } = calculateTotals(quote?.quoteDetails);
                return (
                  <div className="relative" key={quote?.repairShopQuoteID}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(quote?.repairShopQuoteID)}
                      className=" uppercase font-chakra bg-transparent inline-flex w-full justify-center gap-x-1.5 rounded-md mt-4 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300"
                      id="menu-button"
                      aria-expanded={isModalOpen}
                      aria-haspopup="true"
                    >
                      Refacciones Solicitadas
                      <svg
                        className="-mr-1 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {openDropdownId === quote?.repairShopQuoteID && (
                      <div
                        className="mt-2 w-full rounded-md bg-transparent border border-[#D26528] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                      >
                        <div className="py-1 flex flex-row mb-4 p-4 content-center text-lg">
                          <div>
                            <h2 className="text-white font-chakra font-bold">
                              Refacciones:
                            </h2>
                            <ul>
                              {quote?.items.map((item, idx) => (
                                <div
                                  className="text-white flex-wrap ml-2"
                                  key={`item-${idx}`}
                                >
                                  <li className="font-chakra text-lg">
                                    {item?.concept}
                                  </li>
                                </div>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <QuotesList
                        carQuoteId={quote?.shopQuote}
                        quotes={quote?.quoteDetails}
                        handleQuoteChange={openModal}
                        selectedQuoteIdx={selectedQuoteIndex}
                        onQuoteRejected={triggerRefresh}
                        currencyFormatter={currencyFormatter}
                      />
                    </div>
                    <div className="p-4 font-bold flex w-full justify-self-center">
                      <div className="w-full">
                        <div className="border-b border-[#343434] flex justify-between py-2">
                          <div className="flex justify-start">
                            <p className="font-chakra">Comisión</p>
                          </div>
                          <div className="flex justify-end">
                            <p className="font-chakra">
                              {currencyFormatter.format(quote.fairRefacFee)}
                            </p>
                          </div>
                        </div>
                        <div className="border-b border-[#343434] flex justify-between py-2">
                          <div className="flex justify-start">
                            <p className="font-chakra">SUBTOTAL</p>
                          </div>
                          <div className="flex justify-end">
                            <p className="font-chakra">
                              {currencyFormatter.format(subtotal)}
                            </p>
                          </div>
                        </div>
                        <div className="border-b border-[#343434] flex justify-between py-2">
                          <div className="flex justify-start">
                            <p className="font-chakra">IVA</p>
                          </div>
                          <div className="flex justify-end">
                            <p className="font-chakra">
                              {currencyFormatter.format(iva)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="flex justify-start">
                            <p className="font-chakra">TOTAL</p>
                          </div>
                          <div className="flex justify-end">
                            <p className="font-chakra">
                              {currencyFormatter.format(
                                quote.totalWithFairRefacFee
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-center py-4">
                          <button
                            className="border-2 border-[#D26528] cursor-pointer text-white px-4 py-2 font-chakra rounded"
                            onClick={() => handlePayment(quote?.shopQuote)}
                          >
                            PAGAR
                          </button>
                        </div>
                      </div>
                    </div>
                    {isModalOpen && selectedQuote && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative mt-51 md:mt-4 bg-[#161616] p-8 w-full md:w-3/4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                          <img
                            src={
                              "https://fairefac-assets.s3.us-east-2.amazonaws.com/Close-orange.png"
                            }
                            alt="Cerrar"
                            className="absolute top-4 right-4 cursor-pointer w-6 h-6"
                            onClick={closeModal}
                          />
                          <h2 className="font-chakra font-bold text-[24px] mb-4">
                            COTIZACION SELECCIONADA
                          </h2>

                          <QuoteTable
                            closeModal={closeModal}
                            currencyFormatter={currencyFormatter}
                            quote={selectedQuote}
                            onQuoteRejected={triggerRefresh}
                            repairShopQuoteID={quote.repairShopQuoteID}
                            token={token}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        {!loading && quotesReview?.length === 0 && (
          <div>
            <h1 className="font-chakra font-semibold text-xl">
              No hay Cotizaciones
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
