import { useState, useEffect } from "react";
import FollowUpTable from "./FollowUpTable";
import FollowUpRepairshopQuoteModal from "./FollowUpRepairshopQuoteModal";

export default function FollowUpPanel({ repairShop }) {
  const [quotes, setQuotes] = useState(repairShop?.quotes || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const updateQuote = (updatedQuote) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote._id === updatedQuote._id
          ? { ...quote, status: updatedQuote.status }
          : quote
      )
    );
  };

  const rowsPerPage = 10;
  const totalPages = Math.ceil(quotes.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredQuotes = statusFilter
    ? quotes.filter((quote) => quote.status === statusFilter)
    : quotes;

  const displayedQuotes = filteredQuotes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleQuoteClick = (quote) => setSelectedQuote(quote);
  const closeModal = () => setSelectedQuote(null);

  useEffect(() => {
    document.body.style.overflow = selectedQuote ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedQuote]);

  return quotes.length === 0 ? (
    <main className="flex flex-col items-center md:justify-center h-screen bg-black text-white">
      <h2 className="text-base md:text-2xl font-chakra uppercase font-bold mb-4 p-8">
        Gestiona las cotizaciones de forma eficiente. Podrás filtrar por estado,
        ver los detalles del taller mecánico, incluyendo el nombre del
        encargado, número telefónico, dirección y nombre del taller. Además,
        podrás actualizar el estado de las cotizaciones para enviarlas o marcar
        cuando las refacciones hayan sido recibidas.
      </h2>
    </main>
  ) : (
    <div className="overflow-x-auto w-full bg-[#161616]">
      <FollowUpTable
        quotes={displayedQuotes}
        onQuoteClick={handleQuoteClick}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-[#D26528] text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-[#D26528] text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      {selectedQuote && (
        <FollowUpRepairshopQuoteModal
          quote={selectedQuote}
          closeModal={closeModal}
          onUpdate={updateQuote}
        />
      )}
    </div>
  );
}
