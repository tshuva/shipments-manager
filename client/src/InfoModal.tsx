import { Group } from "./App"

interface prop {
  selectedRow: Group
  setShowModal: React.Dispatch<React.SetStateAction<Group | null>>
}

const InfoModal = ({ selectedRow, setShowModal }: prop) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50" onClick={() => setShowModal(null)}>
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative" onClick={(e) => e.stopPropagation()}>
      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={() => setShowModal(null)}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl text-white font-bold mb-4">{selectedRow.name} With Priority : {selectedRow.priority}</h2>
      <p className="text-gray-300 mb-4">{selectedRow.description}</p>
      <div className="border-t border-gray-600 pt-4">
        <h3 className="text-lg text-gray-300 font-semibold mb-2">Criteria:</h3>
        <div>
          <p className="text-gray-300 mb-2">
            From: {selectedRow.criteria.from.join(', ')}
          </p>
          <p className="text-gray-300">
            To: {selectedRow.criteria.to.join(', ')}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-600 pt-4">
        <h3 className="text-lg text-gray-300 font-semibold mb-2">Alert Rules:</h3>
        <div>
          <p className="text-gray-300 mb-2">
            Shipment: {selectedRow.alertRules.shipment ? 'Enabled' : 'Disabled'}
          </p>
          <p className="text-gray-300">
            Temperature: {selectedRow.alertRules.temperature.on ? 'On' : 'Off'}
            {selectedRow.alertRules.temperature.on && (
              <>
                {selectedRow.alertRules.temperature.min && (
                  <span> Min: {selectedRow.alertRules.temperature.min}°C</span>
                )}
                {selectedRow.alertRules.temperature.max && (
                  <span> Max: {selectedRow.alertRules.temperature.max}°C</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default InfoModal
