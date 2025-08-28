import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Use only one import for MaterialCommunityIcons

const API_TOKEN = "lZ6z0Lou0ldxwy4MXHzdc2ZpSREmhqDo8_vB_pPx";

// Static sample data
const continents = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
const countries = {
  Asia: ["Pakistan", "India", "China", "Japan", "South Korea", "Saudi Arabia", "Iran", "Turkey", "Indonesia", "Thailand", "Philippines", "Vietnam", "Malaysia", "Singapore", "Israel", "Lebanon", "Jordan", "Syria", "Iraq", "Afghanistan", "Nepal", "Bangladesh", "Sri Lanka", "Myanmar", "Cambodia", "Laos", "Kazakhstan", "Uzbekistan"],
  Europe: ["Germany", "France", "UK", "Italy", "Spain", "Portugal", "Netherlands", "Belgium", "Austria", "Switzerland", "Poland", "Czech Republic", "Hungary", "Greece", "Turkey", "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Romania", "Bulgaria", "Serbia", "Croatia", "Bosnia and Herzegovina", "Albania", "North Macedonia", "Montenegro", "Slovenia", "Slovakia", "Lithuania", "Latvia", "Estonia"],
  "North America": ["USA", "Canada", "Mexico", "Guatemala", "Belize", "El Salvador", "Honduras", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Jamaica", "Haiti", "Dominican Republic", "Trinidad and Tobago"],
  "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname"],
  Africa: ["Egypt", "Nigeria", "South Africa", "Kenya", "Ethiopia", "Tanzania", "Ghana", "Morocco", "Algeria", "Tunisia", "Libya", "Sudan", "Angola", "Mozambique", "Zimbabwe", "Zambia", "Uganda", "Rwanda", "Burundi", "Democratic Republic of Congo", "Republic of Congo", "Gabon", "Senegal", "Mali", "Niger", "Chad", "Somalia", "Djibouti", "Eritrea", "Madagascar", "Mauritius", "Seychelles", "Botswana", "Namibia", "Lesotho", "Swaziland"],
  Oceania: ["Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands", "Vanuatu", "Samoa", "Tonga", "Kiribati", "Marshall Islands", "Micronesia", "Palau", "Nauru", "Tuvalu"],
};
const cities = {
  Pakistan: ["Islamabad", "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Gujranwala", "Peshawar", "Quetta"],
  India: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"],
  China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chongqing", "Tianjin", "Wuhan", "Dongguan", "Shenyang", "Hangzhou"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Kobe", "Fukuoka", "Kawasaki", "Saitama"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Jeonju", "Cheongju"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Buraidah", "Khamis Mushait", "Hail"],
  Iran: ["Tehran", "Mashhad", "Isfahan", "Karaj", "Shiraz", "Tabriz", "Qom", "Ahvaz", "Kermanshah", "Urmia"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep", "Konya", "Antalya", "Kayseri", "Mersin", "Eskisehir", "Diyarbakir", "Samsun", "Denizli", "Kahramanmaras", "Malatya", "Erzurum", "Van", "Sakarya", "Batman", "Balikesir", "Trabzon", "Ordu", "Manisa", "Mugla", "Aydin", "Hatay", "Tekirdag", "Canakkale", "Isparta", "Bolu", "Kocaeli", "Zonguldak", "Kutahya", "Afyonkarahisar", "Nigde", "Aksaray", "Kirikkale", "Karabuk", "Bilecik", "Yozgat", "Cankiri", "Corum", "Amasya", "Tokat", "Sivas", "Erzincan", "Tunceli", "Elazig", "Bingol", "Mus", "Bitlis", "Hakkari", "Igdır", "Ardahan", "Kars", "Agri", "Siirt", "Sirnak", "Mardin", "Sanliurfa", "Adiyaman", "Kilis", "Osmaniye", "Karaman", "Kirsehir", "Nevsehir", "Yalova", "Duzce", "Burdur", "Usak", "Kirklareli", "Edirne", "Sinop", "Bartin", "Karabuk", "Artvin", "Rize"],
  Indonesia: ["Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Tangerang", "Depok", "Semarang", "Palembang", "Makassar"],
  Thailand: ["Bangkok", "Nonthaburi", "Pak Kret", "Hat Yai", "Chiang Mai", "Phuket", "Pattaya", "Udon Thani", "Chon Buri", "Songkhla"],
  Philippines: ["Manila", "Quezon City", "Caloocan", "Davao", "Cebu City", "Zamboanga", "Antipolo", "Taguig", "Valenzuela", "Cagayan de Oro"],
  Vietnam: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Bien Hoa", "Hue", "Nha Trang", "Can Tho", "Rach Gia", "Quy Nhon", "Vung Tau"],
  Malaysia: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Johor Bahru", "Seremban", "Kuching", "Kota Kinabalu", "Klang"],
  Singapore: ["Singapore"],
  Israel: ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva", "Ashdod", "Netanya", "Beersheba", "Bnei Brak", "Holon"],
  Lebanon: ["Beirut", "Tripoli", "Sidon", "Tyre", "Nabatieh", "Jounieh", "Zahlé", "Baalbek", "Byblos", "Batroun"],
  Jordan: ["Amman", "Irbid", "Zarqa", "Aqaba", "Madaba", "Mafraq", "Jerash", "Ajloun", "Karak", "Ma'an"],
  Syria: ["Damascus", "Aleppo", "Homs", "Latakia", "Hama", "Deir ez-Zor", "Raqqa", "Daraa", "Al-Hasakah", "Tartus"],
  Iraq: ["Baghdad", "Basra", "Mosul", "Erbil", "Sulaymaniyah", "Najaf", "Karbala", "Kirkuk", "Nasiriyah", "Amarah"],
  Afghanistan: ["Kabul", "Herat", "Kandahar", "Mazar-i-Sharif", "Kunduz", "Jalalabad", "Lashkar Gah", "Taloqan", "Puli Khumri", "Khost"],
  Nepal: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Dharan", "Hetauda", "Janakpur", "Nepalgunj"],
  Bangladesh: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur"],
  "Sri Lanka": ["Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Negombo", "Kandy", "Kalmunai", "Trincomalee", "Galle", "Jaffna", "Batticaloa"],
  Myanmar: ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago", "Pathein", "Monywa", "Meiktila", "Taunggyi", "Sittwe"],
  Cambodia: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Poipet", "Kampong Cham", "Pursat", "Ta Khmau", "Kampong Chhnang", "Kampong Thom"],
  Laos: ["Vientiane", "Pakse", "Savannakhet", "Luang Prabang", "Thakhek", "Xam Neua", "Muang Xay", "Phonsavan", "Vang Vieng", "Muang Phon-Hong"],
  Kazakhstan: ["Almaty", "Nur-Sultan", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau"],
  Uzbekistan: ["Tashkent", "Namangan", "Samarkand", "Andijan", "Bukhara", "Nukus", "Qarshi", "Kokand", "Fergana", "Margilan"],
  Germany: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille"],
  UK: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Bristol", "Leicester"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Murcia", "Las Palmas", "Palma", "Bilbao"],
  Portugal: ["Lisbon", "Porto", "Amadora", "Braga", "Setúbal", "Coimbra", "Funchal", "Almada", "Faro", "Vila Nova de Gaia"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen"],
  Belgium: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst"],
  Austria: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn"],
  Switzerland: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne"],
  Poland: ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"],
  "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc", "České Budějovice", "Hradec Králové", "Ústí nad Labem", "Pardubice"],
  Hungary: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely"],
  Greece: ["Athens", "Thessaloniki", "Patras", "Piraeus", "Larissa", "Heraklion", "Ioannina", "Chania", "Chalcis", "Volos"],
  Sweden: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"],
  Norway: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Kristiansand", "Fredrikstad", "Tromsø", "Sandnes", "Drammen", "Skien"],
  Denmark: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde"],
  Finland: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Pori"],
  Ireland: ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan"],
  Romania: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați", "Ploiești", "Oradea"],
  Bulgaria: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"],
  Serbia: ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Leskovac", "Zrenjanin", "Pančevo", "Čačak", "Kruševac"],
  Croatia: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Slavonski Brod", "Pula", "Karlovac", "Sisak", "Varaždin"],
  "Bosnia and Herzegovina": ["Sarajevo", "Banja Luka", "Tuzla", "Zenica", "Mostar", "Prijedor", "Bihać", "Brčko", "Bijeljina", "Trebinje"],
  Albania: ["Tirana", "Durrës", "Vlorë", "Shkodër", "Korçë", "Fier", "Elbasan", "Kamëz", "Pogradec", "Berat"],
  "North Macedonia": ["Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Veles", "Ohrid", "Gostivar", "Strumica", "Kavadarci"],
  Montenegro: ["Podgorica", "Nikšić", "Herceg Novi", "Bar", "Pljevlja", "Bijelo Polje", "Cetinje", "Budva", "Ulcinj", "Kotor"],
  Slovenia: ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj", "Trbovlje", "Kamnik"],
  Slovakia: ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra", "Banská Bystrica", "Trnava", "Martin", "Trenčín", "Poprad"],
  Lithuania: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Mažeikiai", "Jonava", "Utena"],
  Latvia: ["Riga", "Daugavpils", "Liepāja", "Jelgava", "Jūrmala", "Ventspils", "Rēzekne", "Valmiera", "Jēkabpils", "Ogre"],
  Estonia: ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve", "Viljandi", "Rakvere", "Maardu", "Kuressaare", "Sillamäe"],
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  Canada: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Ciudad Juárez", "Toluca", "Querétaro"],
  Guatemala: ["Guatemala City", "Mixco", "Villa Nueva", "Petapa", "San Juan Sacatepéquez", "Quetzaltenango", "Villa Canales", "Escuintla", "Chimaltenango", "Chinautla"],
  Belize: ["Belize City", "Belmopan", "San Ignacio", "Orange Walk", "San Pedro", "Corozal", "Dangriga", "Benque Viejo del Carmen", "Punta Gorda", "San Jose Succotz"],
  "El Salvador": ["San Salvador", "Santa Ana", "San Miguel", "Soyapango", "Santa Tecla", "Apopa", "Mejicanos", "San Martín", "Ilopango", "Ahuachapán"],
  Honduras: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "El Progreso", "Comayagua", "Puerto Cortés", "Choluteca", "Danlí", "Villanueva"],
  Nicaragua: ["Managua", "León", "Masaya", "Tipitapa", "Chinandega", "Matagalpa", "Estelí", "Jinotepe", "Granada", "Bluefields"],
  "Costa Rica": ["San José", "Puerto Limón", "San Francisco", "Alajuela", "Paraíso", "Liberia", "Puntarenas", "San Vicente", "Escazú", "Curridabat"],
  Panama: ["Panama City", "San Miguelito", "Tocumen", "David", "Arraiján", "Colón", "La Chorrera", "Penonomé", "Chitré", "Santiago"],
  Cuba: ["Havana", "Santiago de Cuba", "Camagüey", "Holguín", "Guantánamo", "Santa Clara", "Bayamo", "Las Tunas", "Cienfuegos", "Pinar del Río"],
  Jamaica: ["Kingston", "Spanish Town", "Portmore", "Montego Bay", "May Pen", "Mandeville", "Old Harbour", "Savanna-la-Mar", "Lucea", "Falmouth"],
  Haiti: ["Port-au-Prince", "Carrefour", "Delmas", "Cap-Haïtien", "Gonaïves", "Jacmel", "Saint-Marc", "Les Cayes", "Petit-Goâve", "Port-de-Paix"],
  "Dominican Republic": ["Santo Domingo", "Santiago de los Caballeros", "La Romana", "San Pedro de Macorís", "San Francisco de Macorís", "La Vega", "San Felipe de Puerto Plata", "San Cristóbal", "Puerto Plata", "Moca"],
  "Trinidad and Tobago": ["Chaguanas", "San Fernando", "Port of Spain", "Arima", "Couva", "Point Fortin", "Scarborough", "Tunapuna", "Debe", "Princes Town"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"],
  Argentina: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", "Mar del Plata", "Salta", "Santa Fe", "San Juan"],
  Chile: ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Rancagua", "Talca", "Arica", "Iquique"],
  Colombia: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué"],
  Peru: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Huancayo", "Piura", "Iquitos", "Cusco", "Pucallpa", "Tacna"],
  Venezuela: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal", "Maturín", "Barcelona", "Petare"],
  Ecuador: ["Guayaquil", "Quito", "Cuenca", "Santo Domingo", "Machala", "Durán", "Portoviejo", "Manta", "Loja", "Ambato"],
  Bolivia: ["Santa Cruz de la Sierra", "La Paz", "Cochabamba", "Sucre", "Oruro", "Tarija", "Potosí", "Sacaba", "Quillacollo", "Trinidad"],
  Paraguay: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá", "Lambaré", "Fernando de la Mora", "Limpio", "Nemby", "Pedro Juan Caballero"],
  Uruguay: ["Montevideo", "Salto", "Paysandú", "Las Piedras", "Rivera", "Maldonado", "Tacuarembó", "Melo", "Mercedes", "Artigas"],
  Guyana: ["Georgetown", "Linden", "New Amsterdam", "Anna Regina", "Bartica", "Skeldon", "Rosignol", "Mahaica", "Vreed-en-Hoop", "Parika"],
  Suriname: ["Paramaribo", "Lelydorp", "Brokopondo", "Nieuw Nickerie", "Moengo", "Mariënburg", "Albina", "Wageningen", "Groningen", "Onverwacht"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Asyut", "Mansoura", "Tanta"],
  Nigeria: ["Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Aba", "Jos"],
  "South Africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Pietermaritzburg", "Polokwane", "Rustenburg"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kehancha", "Ruiru", "Naivasha", "Kitale", "Garissa"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Adama", "Gondar", "Mek'ele", "Awasa", "Bahir Dar", "Dessie", "Jimma", "Jijiga"],
  Tanzania: ["Dar es Salaam", "Dodoma", "Mwanza", "Zanzibar City", "Arusha", "Mbeya", "Morogoro", "Tanga", "Kahama", "Tabora"],
  Ghana: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Ashaiman", "Obuasi", "Tema", "Madina", "Cape Coast", "Koforidua"],
  Morocco: ["Casablanca", "Rabat", "Fes", "Marrakesh", "Agadir", "Tangier", "Meknes", "Oujda", "Kenitra", "Tetouan"],
  Algeria: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif", "Sidi Bel Abbès", "Biskra"],
  Tunisia: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous"],
  Libya: ["Tripoli", "Benghazi", "Misrata", "Bayda", "Zawiya", "Ajdabiya", "Sabha", "Derna", "Zliten", "Tobruk"],
  Sudan: ["Khartoum", "Omdurman", "North Khartoum", "Nyala", "Port Sudan", "Kassala", "El Obeid", "Kosti", "El Fasher", "Geneina"],
  Angola: ["Luanda", "Huambo", "Lobito", "Kuito", "Lubango", "Malanje", "Lucapa", "Benguela", "Cabinda", "Namibe"],
  Mozambique: ["Maputo", "Matola", "Nampula", "Beira", "Chimoio", "Quelimane", "Nacala", "Tete", "Xai-Xai", "Lichinga"],
  Zimbabwe: ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe", "Kadoma", "Masvingo", "Marondera", "Norton"],
  Zambia: ["Lusaka", "Ndola", "Kitwe", "Chingola", "Mufulira", "Luanshya", "Kabwe", "Livingstone", "Chipata", "Kalulushi"],
  Uganda: ["Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Bwizibwera", "Mbale", "Masaka", "Kasese", "Hoima"],
  Rwanda: ["Kigali", "Butare", "Gitarama", "Ruhengeri", "Byumba", "Cyangugu", "Kibungo", "Gisenyi", "Kibuye", "Nyanza"],
  Burundi: ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Kayanza", "Muyinga", "Bururi", "Makamba", "Rutana", "Muramvya"],
  "Democratic Republic of Congo": ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kananga", "Kisangani", "Likasi", "Tshikapa", "Kolwezi", "Bukavu", "Matadi"],
  "Republic of Congo": ["Brazzaville", "Pointe-Noire", "Loubomo", "Nkayi", "Dolisie", "Madingou", "Owando", "Ouesso", "Gamboma", "Mossendjo"],
  Gabon: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou"],
  Senegal: ["Dakar", "Pikine", "Thiès", "Kaolack", "Ziguinchor", "Rufisque", "Saint-Louis", "Diourbel", "Touba", "M'Bour"],
  Mali: ["Bamako", "Sikasso", "Mopti", "Koutiala", "Ségou", "Kayes", "Niono", "Markala", "Kati", "Gao"],
  Niger: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso", "Birni N'Konni", "Diffa", "Arlit", "Gaya"],
  Chad: ["N'Djamena", "Moundou", "Sarh", "Abeche", "Kelo", "Koumra", "Doba", "Pala", "Ati", "Bongor"],
  Somalia: ["Mogadishu", "Hargeisa", "Kismayo", "Bosaso", "Galkayo", "Baidoa", "Marka", "Jowhar", "Bardera", "Beledweyne"],
  Djibouti: ["Djibouti", "Ali Sabieh", "Tadjoura", "Dikhil", "Arta", "Obock", "Holhol", "Dorra", "Balho", "Yoboki"],
  Eritrea: ["Asmara", "Keren", "Massawa", "Assab", "Mendefera", "Barentu", "Adi Quala", "Edd", "Dekemhare", "Nakfa"],
  Madagascar: ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga", "Toliara", "Antsiranana", "Ambatondrazaka", "Fenoarivo Atsinanana", "Ambilobe"],
  Mauritius: ["Port Louis", "Beau Bassin-Rose Hill", "Vacoas-Phoenix", "Curepipe", "Quatre Bornes", "Goodlands", "Triolet", "Mahebourg", "Saint Pierre", "Le Hochet"],
  Seychelles: ["Victoria", "Anse Boileau", "Bel Ombre", "Beau Vallon", "Takamaka", "Anse Royale", "Mont Fleuri", "Cascade", "Glacis", "Anse Etoile"],
  Botswana: ["Gaborone", "Francistown", "Molepolole", "Selebi-Phikwe", "Maun", "Serowe", "Kanye", "Jwaneng", "Lobatse", "Mochudi"],
  Namibia: ["Windhoek", "Rundu", "Walvis Bay", "Swakopmund", "Oshakati", "Katima Mulilo", "Gobabis", "Otjiwarongo", "Keetmanshoop", "Rehoboth"],
  Lesotho: ["Maseru", "Teyateyaneng", "Mafeteng", "Hlotse", "Mohale's Hoek", "Butha-Buthe", "Mokhotlong", "Qacha's Nek", "Quthing", "Maputsoe"],
  Swaziland: ["Mbabane", "Manzini", "Big Bend", "Nhlangano", "Malkerns", "Hluti", "Siteki", "Piggs Peak", "Lavumisa", "Mhlume"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", "Dunedin", "Palmerston North", "Nelson", "Rotorua"],
  Fiji: ["Suva", "Nadi", "Lautoka", "Labasa", "Ba", "Tavua", "Rakiraki", "Levuka", "Savusavu", "Sigatoka"],
  "Papua New Guinea": ["Port Moresby", "Lae", "Arawa", "Mount Hagen", "Madang", "Wewak", "Goroka", "Kokopo", "Kimbe", "Popondetta"],
  "Solomon Islands": ["Honiara", "Gizo", "Auki", "Tulagi", "Buala", "Taro"],
  Vanuatu: ["Port Vila", "Luganville", "Isangel", "Sola", "Lakatoro"],
  Samoa: ["Apia", "Asau", "Salelologa", "Mulifanua", "Faleolo"],
  Tonga: ["Nukuʻalofa", "Neiafu", "Havelufo", "Vaini"],
  Kiribati: ["South Tarawa", "Betio", "Bairiki", "London", "Kiritimati"],
  "Marshall Islands": ["Majuro", "Ebeye", "Jabor", "Enewetak", "Wotje"],
  Micronesia: ["Palikir", "Weno", "Tofol", "Kolonia", "Lele"],
  Palau: ["Ngerulmud", "Koror", "Airai", "Meyuns"],
  Nauru: ["Yaren", "Denigomodu", "Meneng", "Anibare", "Boe"],
  Tuvalu: ["Funafuti", "Vaiaku", "Alapi", "Fakai Fou", "Senala"],
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [continent, setContinent] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [menuType, setMenuType] = useState(null); // 'continent', 'country', 'city', 'timeRange'
  const [locationChecked, setLocationChecked] = useState(false);
  const [firstAutoSearchDone, setFirstAutoSearchDone] = useState(false);
  // Helper to map country to continent
  function getContinentFromCountry(countryName) {
    for (const [cont, countriesArr] of Object.entries(countries)) {
      if (countriesArr.includes(countryName)) return cont;
    }
    return null;
  }

  // Helper to get city from country
  function getCityFromCountry(countryName, cityName) {
    if (cities[countryName] && cities[countryName].includes(cityName)) return cityName;
    return cities[countryName] ? cities[countryName][0] : null;
  }

  // Detect location on mount
  // Load MaterialCommunityIcons font before rendering icons
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(MaterialCommunityIcons.font);
        setFontsLoaded(true);
      } catch (e) {
        console.error("Font loading error:", e);
        setFontsLoaded(true); // Prevent app from being stuck
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    async function detectLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationChecked(true);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        let geo = await Location.reverseGeocodeAsync(loc.coords);
        if (geo && geo.length > 0) {
          const detectedCountry = geo[0].country;
          const detectedCity = geo[0].city;
          const continentGuess = getContinentFromCountry(detectedCountry);
          setContinent(continentGuess);
          setCountry(detectedCountry);
          setCity(getCityFromCountry(detectedCountry, detectedCity));
          setTimeRange("thisyear"); // Autofill timeRange as 'thisyear'
        }
      } catch (e) {
        // Ignore location errors
      } finally {
        setLocationChecked(true);
      }
    }
    if (!locationChecked && !continent && !country && !city) {
      detectLocation();
    }
  }, [locationChecked, continent, country, city]);

  // Auto-search for events after autofill (first time only)
  useEffect(() => {
    if (
      continent && country && city && timeRange === "thisyear" && !firstAutoSearchDone
    ) {
      fetchEvents();
      setFirstAutoSearchDone(true);
    }
  }, [continent, country, city, timeRange, firstAutoSearchDone]);

  const timeOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisweek" },
    { label: "This Month", value: "thismonth" },
    { label: "This Year", value: "thisyear" },
  ];

  const fetchEvents = async () => {
    if (!city || !timeRange) return;
    setLoading(true);
    try {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);

      switch (timeRange) {
        case "today":
          end.setDate(now.getDate() + 1);
          break;
        case "thisweek":
          end.setDate(now.getDate() + 7);
          break;
        case "thismonth":
          end.setMonth(now.getMonth() + 1);
          break;
        case "thisyear":
          end.setFullYear(now.getFullYear() + 1);
          break;
      }

      const url = `https://api.predicthq.com/v1/events/?q=${encodeURIComponent(
        city
      )}&start.gte=${start.toISOString()}&start.lte=${end.toISOString()}`;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      setEvents(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Fetch events error:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city && timeRange) fetchEvents();
  }, [city, timeRange]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#302b63" />
        <Text style={{ marginTop: 20, color: "#302b63", fontSize: 16 }}>Loading assets...</Text>
      </View>
    );
  }

  if (showWelcome) {
    return (
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.welcome}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#f093fb", "#f5576c"]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={require("./assets/icon_nobg.png")}
                style={{ width: 60, height: 60, borderRadius: 30 }}
                resizeMode="cover"
              />
            </LinearGradient>
          </View>
          <Text style={styles.welcomeTitle}>EventCast</Text>
          <Text style={styles.welcomeSubtitle}>Discover extraordinary experiences</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => setShowWelcome(false)} activeOpacity={0.8}>
            <LinearGradient
              colors={["#f093fb", "#f5576c"]}
              style={styles.startBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.startBtnText}>Discover Events</Text>
              <Icon name="arrow-right" size={20} color="#ffffff" style={styles.startBtnIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      {/* Header */}
      <LinearGradient colors={["#0f0c29", "#302b63"]} style={styles.headerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={styles.headerContent}>
          <Image
            source={require("./assets/icon_nobg.png")}
            style={{ width: 28, height: 28, borderRadius: 8, marginRight: 8 }}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>EventCast</Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <FlatList
          data={events}
          keyExtractor={(item, idx) => String(item?.id ?? idx)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventListContent}
          ListHeaderComponent={
            <>
              {/* Filters */}
              <View style={styles.dropdownsContainer}>
                {/* Continent */}
                <View style={styles.dropdownWrapper}>
                  <View style={styles.dropdownIconContainer}>
                    <Icon name="earth" size={20} color="#302b63" />
                  </View>
                  <TouchableOpacity style={styles.dropdown} onPress={() => setMenuType("continent")} activeOpacity={0.8}>
                    <Text style={{ color: continent ? "#302b63" : "#aaa", fontSize: 16 }}>
                      {continent || "Select Continent"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Country */}
                {continent && (
                  <View style={styles.dropdownWrapper}>
                    <View style={styles.dropdownIconContainer}>
                      <Icon name="flag-variant" size={20} color="#302b63" />
                    </View>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setMenuType("country")} activeOpacity={0.8}>
                      <Text style={{ color: country ? "#302b63" : "#aaa", fontSize: 16 }}>
                        {country || "Select Country"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* City */}
                {country && (
                  <View style={styles.dropdownWrapper}>
                    <View style={styles.dropdownIconContainer}>
                      <Icon name="city-variant" size={20} color="#302b63" />
                    </View>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setMenuType("city")} activeOpacity={0.8}>
                      <Text style={{ color: city ? "#302b63" : "#aaa", fontSize: 16 }}>{city || "Select City"}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Time Range */}
                {city && (
                  <View style={styles.dropdownWrapper}>
                    <View style={styles.dropdownIconContainer}>
                      <Icon name="clock-time-four" size={20} color="#302b63" />
                    </View>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setMenuType("timeRange")} activeOpacity={0.8}>
                      <Text style={{ color: timeRange ? "#302b63" : "#aaa", fontSize: 16 }}>
                        {timeOptions.find((o) => o.value === timeRange)?.label || "Select Time Range"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Modal */}
                <Modal visible={!!menuType} transparent animationType="fade" onRequestClose={() => setMenuType(null)}>
                  <TouchableWithoutFeedback onPress={() => setMenuType(null)}>
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                          {menuType === "continent" && "Select Continent"}
                          {menuType === "country" && "Select Country"}
                          {menuType === "city" && "Select City"}
                          {menuType === "timeRange" && "Select Time Range"}
                        </Text>
                        <FlatList
                          data={
                            menuType === "continent"
                              ? continents
                              : menuType === "country"
                              ? countries[continent] || []
                              : menuType === "city"
                              ? cities[country] || []
                              : menuType === "timeRange"
                              ? timeOptions.map((o) => o.label)
                              : []
                          }
                          keyExtractor={(item) => item}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.modalRow}
                              onPress={() => {
                                if (menuType === "continent") {
                                  setContinent(item);
                                  setCountry(null);
                                  setCity(null);
                                } else if (menuType === "country") {
                                  setCountry(item);
                                  setCity(null);
                                } else if (menuType === "city") {
                                  setCity(item);
                                } else if (menuType === "timeRange") {
                                  const value = timeOptions.find((o) => o.label === item)?.value;
                                  setTimeRange(value);
                                }
                                setMenuType(null);
                              }}
                            >
                              <Text style={styles.modalRowText}>{item}</Text>
                            </TouchableOpacity>
                          )}
                          style={{ maxHeight: 300 }}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#302b63" />
                  <Text style={styles.loadingText}>Discovering premium events...</Text>
                </View>
              )}

              {events.length > 0 && (
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>Curated Experiences</Text>
                  <View style={styles.resultsCountContainer}>
                    <Text style={styles.resultsCount}>{events.length}</Text>
                    <Text style={styles.resultsCountLabel}>events</Text>
                  </View>
                </View>
              )}
            </>
          }
          renderItem={({ item, index }) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardIconContainer}>
                  <Icon name="star" size={18} color="#f5576c" />
                </View>
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.cardMetaItem}>
                  <Icon name="calendar" size={16} color="#302b63" />
                  <Text style={styles.cardDetails}>
                    {item.start
                      ? new Date(item.start).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date"}
                  </Text>
                </View>
                <View style={styles.cardMetaItem}>
                  <Icon name="clock-outline" size={16} color="#302b63" />
                  <Text style={styles.cardDetails}>
                    {item.start
                      ? new Date(item.start).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No time"}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>{item.description || "No description available"}</Text>
              {item.entities && item.entities[0] && (
                <TouchableOpacity
                  style={styles.cardLink}
                  activeOpacity={0.7}
                  onPress={() => {
                    const venueUrl = item.entities[0].url;
                    if (venueUrl) {
                      Linking.openURL(venueUrl);
                    } else {
                      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.entities[0].name)}`;
                      Linking.openURL(searchUrl);
                    }
                  }}
                >
                  <Icon name="link-variant" size={16} color="#302b63" />
                  <Text style={[styles.linkText, { color: '#1e88e5', textDecorationLine: 'underline' }]}>{item.entities[0].name}</Text>
                </TouchableOpacity>
              )}
              {item.url && (
                <TouchableOpacity
                  style={styles.cardLink}
                  onPress={() => Linking.openURL(item.url)}
                  activeOpacity={0.7}
                >
                  <Icon name="web" size={16} color="#302b63" />
                  <Text style={[styles.linkText, { color: '#1e88e5', textDecorationLine: 'underline' }]}>Visit Event Website</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            city && timeRange && !loading ? (
              <View style={styles.noEventsContainer}>
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  style={styles.noEventsIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="calendar-remove" size={40} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.noEventsTitle}>No Events Found</Text>
                <Text style={styles.noEventsText}>Try adjusting your location or time preferences</Text>
              </View>
            ) : null
          }
        />
      </View>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 15,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 60,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  startBtn: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 15,
    borderRadius: 30,
    overflow: "hidden",
  },
  startBtnGradient: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginRight: 15,
  },
  startBtnIcon: {
    marginLeft: 5,
  },
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    marginLeft: 36,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  // ===== Unified dropdown row for Android color consistency =====
  dropdownsContainer: {
    marginBottom: 25,
  },
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15, 12, 41, 0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  dropdownIconContainer: {
    width: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "rgba(15, 12, 41, 0.08)",
  },
  dropdown: {
    flex: 1,
    minHeight: 50,
    backgroundColor: "transparent",
    borderWidth: 0,
    justifyContent: "center",
    paddingLeft: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    minWidth: 260,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#302b63",
  },
  modalRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalRowText: {
    fontSize: 16,
    color: "#302b63",
  },

  loadingContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#302b63",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f0c29",
    letterSpacing: 0.3,
  },
  resultsCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  resultsCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5576c",
    marginRight: 5,
  },
  resultsCountLabel: {
    fontSize: 14,
    color: "#302b63",
    fontWeight: "500",
  },

  eventListContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#f093fb",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f0c29",
    flex: 1,
    marginRight: 10,
    lineHeight: 24,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(245, 87, 108, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardMeta: {
    flexDirection: "row",
    marginBottom: 15,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  cardDetails: {
    fontSize: 14,
    color: "#302b63",
    marginLeft: 8,
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 15,
    color: "#37474f",
    lineHeight: 22,
    marginBottom: 15,
  },
  cardLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  linkText: {
    fontSize: 14,
    color: "#302b63",
    marginLeft: 8,
    fontWeight: "500",
  },
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noEventsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  noEventsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f0c29",
    marginBottom: 10,
  },
  noEventsText: {
    fontSize: 16,
    color: "#302b63",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
