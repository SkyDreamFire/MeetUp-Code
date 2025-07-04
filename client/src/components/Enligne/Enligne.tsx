import React, { useState } from 'react';
import { Heart, MessageSquare, Camera, AlertCircle } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';
import MessageList from '../shared/MessageList';
import PopUpMessage from '../shared/PopUpMessage';
import MessagePanel from '../shared/MessagePanel';
export const EnligneView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [showMessageList, setShowMessageList] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [hasClickedMessage, setHasClickedMessage] = useState(false);

  const handleRemoveConversation = (conversationId: string) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };
  const [filters, setFilters] = useState({
    gender: 'Je suis un/une',
    lookingFor: 'Je recherche un',
    location: 'Tous Pays',
    ageRange: [18, 80],
    hasPhoto: false
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredUsers = users.filter(user => {
    return true; // À implémenter selon les filtres
  });



  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-pink-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <select 
                value={filters.gender} 
                onChange={(e) => handleFilterChange({ gender: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="" className="text-black">Je suis un(e)</option>
                <option value="Homme" className="text-black">Homme</option>
                <option value="Femme" className="text-black">Femme</option>
              </select>

              <select
                value={filters.lookingFor}
                onChange={(e) => handleFilterChange({ lookingFor: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="" className="text-black">Je recherche un(e)</option>
                <option value="Homme" className="text-black">Homme</option>
                <option value="Femme" className="text-black">Femme</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                className="bg-transparent border border-white rounded px-3 py-1"
              >
                <option value="Tous Pays" className="text-black">Tous Pays</option>
                <option value="Afghanistan" className="text-black">Afghanistan</option>
                <option value="Albania" className="text-black">Albania</option>
                <option value="Algeria" className="text-black">Algeria</option>
                <option value="Andorra" className="text-black">Andorra</option>
                <option value="Angola" className="text-black">Angola</option>
                <option value="Antigua and Barbuda" className="text-black">Antigua and Barbuda</option>
                <option value="Argentina" className="text-black">Argentina</option>
                <option value="Armenia" className="text-black">Armenia</option>
                <option value="Australia" className="text-black">Australia</option>
                <option value="Austria" className="text-black">Austria</option>
                <option value="Azerbaijan" className="text-black">Azerbaijan</option>
                <option value="Bahamas" className="text-black">Bahamas</option>
                <option value="Bahrain" className="text-black">Bahrain</option>
                <option value="Bangladesh" className="text-black">Bangladesh</option>
                <option value="Barbados" className="text-black">Barbados</option>
                <option value="Belarus" className="text-black">Belarus</option>
                <option value="Belgium" className="text-black">Belgium</option>
                <option value="Belize" className="text-black">Belize</option>
                <option value="Benin" className="text-black">Benin</option>
                <option value="Bhutan" className="text-black">Bhutan</option>
                <option value="Bolivia" className="text-black">Bolivia</option>
                <option value="Bosnia and Herzegovina" className="text-black">Bosnia and Herzegovina</option>
                <option value="Botswana" className="text-black">Botswana</option>
                <option value="Brazil" className="text-black">Brazil</option>
                <option value="Brunei" className="text-black">Brunei</option>
                <option value="Bulgaria" className="text-black">Bulgaria</option>
                <option value="Burkina Faso" className="text-black">Burkina Faso</option>
                <option value="Burundi" className="text-black">Burundi</option>
                <option value="Cabo Verde" className="text-black">Cabo Verde</option>
                <option value="Cambodia" className="text-black">Cambodia</option>
                <option value="Cameroon" className="text-black">Cameroon</option>
                <option value="Canada" className="text-black">Canada</option>
                <option value="Central African Republic" className="text-black">Central African Republic</option>
                <option value="Chad" className="text-black">Chad</option>
                <option value="Chile" className="text-black">Chile</option>
                <option value="China" className="text-black">China</option>
                <option value="Colombia" className="text-black">Colombia</option>
                <option value="Comoros" className="text-black">Comoros</option>
                <option value="Congo" className="text-black">Congo</option>
                <option value="Costa Rica" className="text-black">Costa Rica</option>
                <option value="Croatia" className="text-black">Croatia</option>
                <option value="Cuba" className="text-black">Cuba</option>
                <option value="Cyprus" className="text-black">Cyprus</option>
                <option value="Czech Republic" className="text-black">Czech Republic</option>
                <option value="Denmark" className="text-black">Denmark</option>
                <option value="Djibouti" className="text-black">Djibouti</option>
                <option value="Dominica" className="text-black">Dominica</option>
                <option value="Dominican Republic" className="text-black">Dominican Republic</option>
                <option value="Ecuador" className="text-black">Ecuador</option>
                <option value="Egypt" className="text-black">Egypt</option>
                <option value="El Salvador" className="text-black">El Salvador</option>
                <option value="Equatorial Guinea" className="text-black">Equatorial Guinea</option>
                <option value="Eritrea" className="text-black">Eritrea</option>
                <option value="Estonia" className="text-black">Estonia</option>
                <option value="Eswatini" className="text-black">Eswatini</option>
                <option value="Ethiopia" className="text-black">Ethiopia</option>
                <option value="Fiji" className="text-black">Fiji</option>
                <option value="Finland" className="text-black">Finland</option>
                <option value="France" className="text-black">France</option>
                <option value="Gabon" className="text-black">Gabon</option>
                <option value="Gambia" className="text-black">Gambia</option>
                <option value="Georgia" className="text-black">Georgia</option>
                <option value="Germany" className="text-black">Germany</option>
                <option value="Ghana" className="text-black">Ghana</option>
                <option value="Greece" className="text-black">Greece</option>
                <option value="Grenada" className="text-black">Grenada</option>
                <option value="Guatemala" className="text-black">Guatemala</option>
                <option value="Guinea" className="text-black">Guinea</option>
                <option value="Guinea-Bissau" className="text-black">Guinea-Bissau</option>
                <option value="Guyana" className="text-black">Guyana</option>
                <option value="Haiti" className="text-black">Haiti</option>
                <option value="Honduras" className="text-black">Honduras</option>
                <option value="Hungary" className="text-black">Hungary</option>
                <option value="Iceland" className="text-black">Iceland</option>
                <option value="India" className="text-black">India</option>
                <option value="Indonesia" className="text-black">Indonesia</option>
                <option value="Iran" className="text-black">Iran</option>
                <option value="Iraq" className="text-black">Iraq</option>
                <option value="Ireland" className="text-black">Ireland</option>
                <option value="Israel" className="text-black">Israel</option>
                <option value="Italy" className="text-black">Italy</option>
                <option value="Jamaica" className="text-black">Jamaica</option>
                <option value="Japan" className="text-black">Japan</option>
                <option value="Jordan" className="text-black">Jordan</option>
                <option value="Kazakhstan" className="text-black">Kazakhstan</option>
                <option value="Kenya" className="text-black">Kenya</option>
                <option value="Kiribati" className="text-black">Kiribati</option>
                <option value="Korea, North" className="text-black">Korea, North</option>
                <option value="Korea, South" className="text-black">Korea, South</option>
                <option value="Kosovo" className="text-black">Kosovo</option>
                <option value="Kuwait" className="text-black">Kuwait</option>
                <option value="Kyrgyzstan" className="text-black">Kyrgyzstan</option>
                <option value="Laos" className="text-black">Laos</option>
                <option value="Latvia" className="text-black">Latvia</option>
                <option value="Lebanon" className="text-black">Lebanon</option>
                <option value="Lesotho" className="text-black">Lesotho</option>
                <option value="Liberia" className="text-black">Liberia</option>
                <option value="Libya" className="text-black">Libya</option>
                <option value="Liechtenstein" className="text-black">Liechtenstein</option>
                <option value="Lithuania" className="text-black">Lithuania</option>
                <option value="Luxembourg" className="text-black">Luxembourg</option>
                <option value="Madagascar" className="text-black">Madagascar</option>
                <option value="Malawi" className="text-black">Malawi</option>
                <option value="Malaysia" className="text-black">Malaysia</option>
                <option value="Maldives" className="text-black">Maldives</option>
                <option value="Mali" className="text-black">Mali</option>
                <option value="Malta" className="text-black">Malta</option>
                <option value="Marshall Islands" className="text-black">Marshall Islands</option>
                <option value="Mauritania" className="text-black">Mauritania</option>
                <option value="Mauritius" className="text-black">Mauritius</option>
                <option value="Mexico" className="text-black">Mexico</option>
                <option value="Micronesia" className="text-black">Micronesia</option>
                <option value="Moldova" className="text-black">Moldova</option>
                <option value="Monaco" className="text-black">Monaco</option>
                <option value="Mongolia" className="text-black">Mongolia</option>
                <option value="Montenegro" className="text-black">Montenegro</option>
                <option value="Morocco" className="text-black">Morocco</option>
                <option value="Mozambique" className="text-black">Mozambique</option>
                <option value="Myanmar" className="text-black">Myanmar</option>
                <option value="Namibia" className="text-black">Namibia</option>
                <option value="Nauru" className="text-black">Nauru</option>
                <option value="Nepal" className="text-black">Nepal</option>
                <option value="Netherlands" className="text-black">Netherlands</option>
                <option value="New Zealand" className="text-black">New Zealand</option>
                <option value="Nicaragua" className="text-black">Nicaragua</option>
                <option value="Niger" className="text-black">Niger</option>
                <option value="Nigeria" className="text-black">Nigeria</option>
                <option value="North Macedonia" className="text-black">North Macedonia</option>
                <option value="Norway" className="text-black">Norway</option>
                <option value="Oman" className="text-black">Oman</option>
                <option value="Pakistan" className="text-black">Pakistan</option>
                <option value="Palau" className="text-black">Palau</option>
                <option value="Palestine" className="text-black">Palestine</option>
                <option value="Panama" className="text-black">Panama</option>
                <option value="Papua New Guinea" className="text-black">Papua New Guinea</option>
                <option value="Paraguay" className="text-black">Paraguay</option>
                <option value="Peru" className="text-black">Peru</option>
                <option value="Philippines" className="text-black">Philippines</option>
                <option value="Poland" className="text-black">Poland</option>
                <option value="Portugal" className="text-black">Portugal</option>
                <option value="Qatar" className="text-black">Qatar</option>
                <option value="Romania" className="text-black">Romania</option>
                <option value="Russia" className="text-black">Russia</option>
                <option value="Rwanda" className="text-black">Rwanda</option>
                <option value="Saint Kitts and Nevis" className="text-black">Saint Kitts and Nevis</option>
                <option value="Saint Lucia" className="text-black">Saint Lucia</option>
                <option value="Saint Vincent and the Grenadines" className="text-black">Saint Vincent and the Grenadines</option>
                <option value="Samoa" className="text-black">Samoa</option>
                <option value="San Marino" className="text-black">San Marino</option>
                <option value="Sao Tome and Principe" className="text-black">Sao Tome and Principe</option>
                <option value="Saudi Arabia" className="text-black">Saudi Arabia</option>
                <option value="Senegal" className="text-black">Senegal</option>
                <option value="Serbia" className="text-black">Serbia</option>
                <option value="Seychelles" className="text-black">Seychelles</option>
                <option value="Sierra Leone" className="text-black">Sierra Leone</option>
                <option value="Singapore" className="text-black">Singapore</option>
                <option value="Slovakia" className="text-black">Slovakia</option>
                <option value="Slovenia" className="text-black">Slovenia</option>
                <option value="Solomon Islands" className="text-black">Solomon Islands</option>
                <option value="Somalia" className="text-black">Somalia</option>
                <option value="South Africa" className="text-black">South Africa</option>
                <option value="South Sudan" className="text-black">South Sudan</option>
                <option value="Spain" className="text-black">Spain</option>
                <option value="Sri Lanka" className="text-black">Sri Lanka</option>
                <option value="Sudan" className="text-black">Sudan</option>
                <option value="Suriname" className="text-black">Suriname</option>
                <option value="Sweden" className="text-black">Sweden</option>
                <option value="Switzerland" className="text-black">Switzerland</option>
                <option value="Syria" className="text-black">Syria</option>
                <option value="Taiwan" className="text-black">Taiwan</option>
                <option value="Tajikistan" className="text-black">Tajikistan</option>
                <option value="Tanzania" className="text-black">Tanzania</option>
                <option value="Thailand" className="text-black">Thailand</option>
                <option value="Timor-Leste" className="text-black">Timor-Leste</option>
                <option value="Togo" className="text-black">Togo</option>
                <option value="Tonga" className="text-black">Tonga</option>
                <option value="Trinidad and Tobago" className="text-black">Trinidad and Tobago</option>
                <option value="Tunisia" className="text-black">Tunisia</option>
                <option value="Turkey" className="text-black">Turkey</option>
                <option value="Turkmenistan" className="text-black">Turkmenistan</option>
                <option value="Tuvalu" className="text-black">Tuvalu</option>
                <option value="Uganda" className="text-black">Uganda</option>
                <option value="Ukraine" className="text-black">Ukraine</option>
                <option value="United Arab Emirates" className="text-black">United Arab Emirates</option>
                <option value="United Kingdom" className="text-black">United Kingdom</option>
                <option value="United States" className="text-black">United States</option>
                <option value="Uruguay" className="text-black">Uruguay</option>
                <option value="Uzbekistan" className="text-black">Uzbekistan</option>
                <option value="Vanuatu" className="text-black">Vanuatu</option>
                <option value="Vatican City" className="text-black">Vatican City</option>
                <option value="Venezuela" className="text-black">Venezuela</option>
                <option value="Vietnam" className="text-black">Vietnam</option>
                <option value="Yemen" className="text-black">Yemen</option>
                <option value="Zambia" className="text-black">Zambia</option>
                <option value="Zimbabwe" className="text-black">Zimbabwe</option>
              </select>

              <div className="flex items-center space-x-2">
                <span>Age</span>
                <input
                  type="number"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange({ ageRange: [parseInt(e.target.value), filters.ageRange[1]] })}
                  className="w-16 bg-transparent border border-white rounded px-2 py-1"
                  min="18"
                  max="80"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange({ ageRange: [filters.ageRange[0], parseInt(e.target.value)] })}
                  className="w-16 bg-transparent border border-white rounded px-2 py-1"
                  min="18"
                  max="80"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasPhoto}
                  onChange={(e) => handleFilterChange({ hasPhoto: e.target.checked })}
                  className="rounded border-white"
                />
                <span>Photo</span>
              </div>
            </div>

            {/* <button className="bg-transparent text-white px-4 py-1 rounded hover:bg-secondary- transition-colors border:black">
              ENVOYER
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative pb-[100%]">
                <img
                  src={user.photos?.[0] || `https://i.pravatar.cc/150?img=${user.id}`}
                  alt={user.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {user.isOnline && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    NOUVEAU!
                  </span>
                  )}
                 {user.isOnline && (
                   <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                 )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{user.name}</h3>
                  <span className="text-sm text-gray-500">{user.age}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{typeof user.location === 'string' ? user.location : `${user.location.lat}, ${user.location.lng}`}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        const newConversation = {
                          id: user.id,
                          name: user.name,
                          age: user.age,
                          avatar: user.photos?.[0],
                          location: user.location,
                          isOnline: user.isOnline
                        };
                        if (!conversations.find(conv => conv.id === user.id)) {
                          setConversations([...conversations, newConversation]);
                        }
                        
                        if (!hasClickedMessage) {
                          // Premier clic : ouvrir directement le PopupMessage
                          setActiveConversation(newConversation);
                          setHasClickedMessage(true);
                        } else {
                          // Clics suivants : afficher la liste des messages
                          setShowMessageList(true);
                        }
                      }}
                    >
                      <MessageSquare className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                          <MessagePanel />
                    </button>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Camera className="w-5 h-5 text-gray-400 hover:text-purple-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Trier par:</span>
            <select className="border rounded px-3 py-1">
              <option value="pertinence">Pertinence</option>
              <option value="recent">Plus récent</option>
              <option value="age">Âge</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">&lt; Précédent</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-r from-pink-500 to-purple-600 text-white">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">3</button>
              <span className="w-8 h-8 flex items-center justify-center">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">114</button>
            </div>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Suivant &gt;</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-row items-start space-x-4">
        {activeConversation && (
          <div className="flex-shrink-0">
            <PopUpMessage
              isOpen={true}
              onClose={() => setActiveConversation(null)}
              recipientName={activeConversation.name}
              recipientAge={activeConversation.age}
              recipientPhoto={activeConversation.avatar || 'https://i.pravatar.cc/150?img=' + activeConversation.id}
              recipientLocation={activeConversation.location}
              isOnline={activeConversation.isOnline}
            />
          </div>
        )}

        {showMessageList && (
          <div className="flex-shrink-0">
            <MessageList
              conversations={conversations.map(conv => ({
                ...conv,
                avatar: conv.avatar || `https://i.pravatar.cc/150?img=${conv.id}`
              }))}
              onSelect={(conversation) => {
                setActiveConversation(conversation);
              }}
              onClose={() => setShowMessageList(false)}
              onRemove={handleRemoveConversation}
            />
          </div>
        )}
      </div>
    </div>
  );
};