// netlify/functions/auth-user-login.mjs
import crypto from 'crypto';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// User database - In production, this could be moved to a file or external service
const USERS_DB = {
  "abraham@orangedcx.com": {
    "passwordHash": "f8984f9f1c36812ea5e118ac4e3a84a97af20e03d42c8377662cc993bdc3e245",
    "name": "Abraham",
    "active": true,
    "role": "user"
  },
  "alfredo@orangedcx.com": {
    "passwordHash": "7a26ac5c0fff49104c9b4b3a3f4b06b8cdc7b4bfcdb0f5feb470fa9e0ca1a820",
    "name": "Alfredo",
    "active": true,
    "role": "user"
  },
  "alexa@orangedcx.com": {
    "passwordHash": "a8ec0d17c9e3d4af00df6b6cf16d6927b546beefc5eb10b5131d5be1469a3aca",
    "name": "Alexa",
    "active": true,
    "role": "user"
  },
  "alejandra@orangedcx.com": {
    "passwordHash": "db0ce8561d374ce85d0efeeaeb05700518ffad31b10b30b3bee0055210dbea4a",
    "name": "Alejandra",
    "active": true,
    "role": "user"
  },
  "alejandro@orangedcx.com": {
    "passwordHash": "640642e9e3e466a7b9cb32a3db560bebcff6e62292d91062e1c48155ebc42bbe",
    "name": "Alejandro",
    "active": true,
    "role": "user"
  },
  "alexis@orangedcx.com": {
    "passwordHash": "c9d01ecf3f04a180661a1941cd1f475b64f2050b6be4f3607dc6801e2e286313",
    "name": "Alexis",
    "active": true,
    "role": "user"
  },
  "asalcedo@orangedcx.com": {
    "passwordHash": "edd666295875c8a0cb95892ffb6dc8971caef636f10b022ae12bc44470fd684c",
    "name": "Asalcedo",
    "active": true,
    "role": "user"
  },
  "alma@orangedcx.com": {
    "passwordHash": "57236db2879b5706bce388591645f495ce9f16d736f454baa6c861811e1d3420",
    "name": "Alma",
    "active": true,
    "role": "user"
  },
  "alonso@orangedcx.com": {
    "passwordHash": "5d920ac3f187104a7a1426834463047b801e839ff76c7969630f24807e74a356",
    "name": "Alonso",
    "active": true,
    "role": "user"
  },
  "ana.robledo@orangedcx.com": {
    "passwordHash": "570b0a328bc3eb8ee42e624d2e6b102901614bb1c34074b985eac15a3288e1fb",
    "name": "Ana Robledo",
    "active": true,
    "role": "user"
  },
  "andrea@orangedcx.com": {
    "passwordHash": "3562298c07aa0bef63fbf63d20eab84a961e0ed060d5f1a732695eb4b0950120",
    "name": "Andrea",
    "active": true,
    "role": "user"
  },
  "acaceres@orangedcx.com": {
    "passwordHash": "b81c4a13bcd93bec1f44c9af929380ab50bdf733777eb81a9710dc8f9ffa5cff",
    "name": "Acaceres",
    "active": true,
    "role": "user"
  },
  "arlette@orangedcx.com": {
    "passwordHash": "c0847e456fbaa8cd39e5f3c124525161d5adcdf097a2f2981dd0670269a08ab4",
    "name": "Arlette",
    "active": true,
    "role": "user"
  },
  "belen.benegas@orangedcx.com": {
    "passwordHash": "b6fac36807f260a9c08a06882105f5a2308bead34225cc71dbfd5f25efb39a84",
    "name": "Belen Benegas",
    "active": true,
    "role": "user"
  },
  "jesus@orangedcx.com": {
    "passwordHash": "28c7eecccaad068a4ffeb537bbcb3f4b1a11e3be1b210f9192870e1f0ceb5844",
    "name": "Jesus",
    "active": true,
    "role": "user"
  },
  "cperez@orangedcx.com": {
    "passwordHash": "1e67262a93829b51a0355d2f086e0398ac8c30a2cb90d88ea82e5d6db5b1aab1",
    "name": "Cperez",
    "active": true,
    "role": "user"
  },
  "cesar@orangedcx.com": {
    "passwordHash": "eca023036502ffe1be8db6f1ec8802bcafad20862a79d0d93cd02738840cafa9",
    "name": "Cesar",
    "active": true,
    "role": "user"
  },
  "antonio@orangedcx.com": {
    "passwordHash": "fac599b5bb52b1e3989a9d24202329499775ad695fdab1a9a01d82b287d6fa29",
    "name": "Antonio",
    "active": true,
    "role": "user"
  },
  "daira@orangedcx.com": {
    "passwordHash": "b964a207c3b3b66a766fa4f40ae6c23d0284f3bf9a2218321c57cfab89c7e720",
    "name": "Daira",
    "active": true,
    "role": "user"
  },
  "daniel@orangedcx.com": {
    "passwordHash": "c922bfcf87cafe6da11c3dcab8a021e08d1706df451f2de3ac490f039da3c379",
    "name": "Daniel",
    "active": true,
    "role": "user"
  },
  "diana@orangedcx.com": {
    "passwordHash": "0eac10c8c1c40fd2c0355a8b5bec9dfa71876e607278e9df45f5c597b348d7cb",
    "name": "Diana",
    "active": true,
    "role": "user"
  },
  "diego@fanxp.digital": {
    "passwordHash": "c64af149a1f600be9807d76121d616c3c980c70ca66a1daf5c43979b47606647",
    "name": "Diego",
    "active": true,
    "role": "user"
  },
  "elena@orangedcx.com": {
    "passwordHash": "886f2e804bd1d8d4c760718110617dec4a848b252df508909eb70d0887b77ab1",
    "name": "Elena",
    "active": true,
    "role": "user"
  },
  "elizabeth@orangedcx.com": {
    "passwordHash": "d17475944ddd62134f20f64bcfd0f8e39dc088b72cea728fc835e6587018c388",
    "name": "Elizabeth",
    "active": true,
    "role": "user"
  },
  "emiliano@orangedcx.com": {
    "passwordHash": "c72a9c4d6f6a6d9db7fbfcb79f86e5c8ac817354a662ea136f895c8348cdfda6",
    "name": "Emiliano",
    "active": true,
    "role": "user"
  },
  "enrique@orangedcx.com": {
    "passwordHash": "35d77f6a27a9e5a0968d56159ce3708fddf2628ba891978a8fe6dba0b9c54057",
    "name": "Enrique",
    "active": true,
    "role": "user"
  },
  "erika@orangedcx.com": {
    "passwordHash": "771ce0f4c4339f2c19a4cad58f88663d7db5a903a51c5bcd065929b3025048aa",
    "name": "Erika",
    "active": true,
    "role": "user"
  },
  "emelendez@orangedcx.com": {
    "passwordHash": "62d10cf3f16f56431e12e48c68a8731b97d2028f9bb2060b0a3f5b1e814fcaac",
    "name": "Emelendez",
    "active": true,
    "role": "user"
  },
  "esperanza@orangedcx.com": {
    "passwordHash": "9a117014d8a97a18a4ad15955d59aeb8bd7fe9748fbed3fa7dc8df45a13f5edf",
    "name": "Esperanza",
    "active": true,
    "role": "user"
  },
  "fabricio@orangedcx.com": {
    "passwordHash": "8879829e5abb9853e71cbf39db288c1d003abf905726eefcd18a4854833476d7",
    "name": "Fabricio",
    "active": true,
    "role": "user"
  },
  "facundo@orangedcx.com": {
    "passwordHash": "858ed92a9a182e4744086bfc54cc52f68629a3e3ad8c482d92df8375557b6ea4",
    "name": "Facundo",
    "active": true,
    "role": "user"
  },
  "felipe@orangedcx.com": {
    "passwordHash": "1a0ebcbf701655e84676c840c9c8eecfb71ca93a11b417fb774f4a0f281307ec",
    "name": "Felipe",
    "active": true,
    "role": "user"
  },
  "ggonzalez@orangedcx.com": {
    "passwordHash": "bf898eeea27bc80d38556be808e53d00a61b560b6db18a23100fd76fe0bc1232",
    "name": "Ggonzalez",
    "active": true,
    "role": "user"
  },
  "genesis@orangedcx.com": {
    "passwordHash": "cf298aa5f0ed2ea38a88bacd09da97bb10eafcf30a55dbb90cbf727428a03e90",
    "name": "Genesis",
    "active": true,
    "role": "user"
  },
  "grecia@orangedcx.com": {
    "passwordHash": "e7f5511f8a7acf75124e1362ced6405f8833a35efc17e22d7c494cd63ec7524d",
    "name": "Grecia",
    "active": true,
    "role": "user"
  },
  "gregorio@orangedcx.com": {
    "passwordHash": "bc2f16c69462a418df8b8493de85a7e1b87f4c97ee4538fe5c95128b0f0c4d4d",
    "name": "Gregorio",
    "active": true,
    "role": "user"
  },
  "ghernandez@orangedcx.com": {
    "passwordHash": "9ab93d4c5f9de3ffbf3fc29f16f44196c799e5a0ad8414440ef9bd6c688a32e1",
    "name": "Ghernandez",
    "active": true,
    "role": "user"
  },
  "hgarcia@orangedcx.com": {
    "passwordHash": "acf18682cc77fdf66105a71b4975e75fefceba88fcabb97bba9a3a0749b1a3c1",
    "name": "Hgarcia",
    "active": true,
    "role": "user"
  },
  "hernan@orangedcx.com": {
    "passwordHash": "8a77ae771d8c7a675d12808eeea2d763d586ae176c6675e4b77625b65b17134a",
    "name": "Hernan",
    "active": true,
    "role": "user"
  },
  "hector@orangedcx.com": {
    "passwordHash": "93591337396eceefb0982a5c3de65a3a98cd0d7bd58b2f50cc0ed8f0ff4fa3a8",
    "name": "Hector",
    "active": true,
    "role": "user"
  },
  "irving@orangedcx.com": {
    "passwordHash": "6bd0023de835c5f850da235936f074420fb92911d110eb73ffd4793667cb877f",
    "name": "Irving",
    "active": true,
    "role": "user"
  },
  "isaac@orangedcx.com": {
    "passwordHash": "023396d33da1664db8d5891b0c1bf654b5ef42861434ccfe296003cd9e072975",
    "name": "Isaac",
    "active": true,
    "role": "user"
  },
  "jennifer@orangedcx.com": {
    "passwordHash": "b52949f1a7a82fa6f023602ace21ee0212cdac2fe0af026141f9112137e13495",
    "name": "Jennifer",
    "active": true,
    "role": "user"
  },
  "jmonjiote@orangedcx.com": {
    "passwordHash": "43615d4fc500e513a0d7813597303f1c1282972776e0dae46b9fb7070cfbfe20",
    "name": "Jmonjiote",
    "active": true,
    "role": "user"
  },
  "joel@orangedcx.com": {
    "passwordHash": "68c2e3a44c8c6107d14274799e5d69769dd2d87b3fe0528f4cd6779053419406",
    "name": "Joel",
    "active": true,
    "role": "user"
  },
  "julian.m@orangedcx.com": {
    "passwordHash": "d6ce0fead5bc087fedba7d8f6e1c179cf2412064a5e9b7b998b35ae3ecb7ac38",
    "name": "Julian M",
    "active": true,
    "role": "user"
  },
  "julieta@orangedcx.com": {
    "passwordHash": "47cec35c8e31a6f8f6e8413eada0beab0f3f2a663dae40fa644e80659739904f",
    "name": "Julieta",
    "active": true,
    "role": "user"
  },
  "karen@orangedcx.com": {
    "passwordHash": "4cc862bf82bf577d9f605bd1640d2fab09d73900e38579d5d7f6fc369dab95ce",
    "name": "Karen",
    "active": true,
    "role": "user"
  },
  "karina@orangedcx.com": {
    "passwordHash": "3f4aa6628d6f7418f44ab3d31427e6395a70d97e8c07f34631a25dc840d1a6eb",
    "name": "Karina",
    "active": true,
    "role": "user"
  },
  "kimberling@orangedcx.com": {
    "passwordHash": "9e4d105d69d9ce0f7c9072069b4612c3a2a2c95ec36311482696bec9c435e4b5",
    "name": "Kimberling",
    "active": true,
    "role": "user"
  },
  "liseth@orangedcx.com": {
    "passwordHash": "038fde3ba7aa2bfc7d199813b7f70aea988c350c56ff289593e12f488e3a0652",
    "name": "Liseth",
    "active": true,
    "role": "user"
  },
  "lucyana@orangedcx.com": {
    "passwordHash": "50b99cb06572e1d0f5c9b86904533493e9ba0004542782345954a46523715760",
    "name": "Lucyana",
    "active": true,
    "role": "user"
  },
  "luis@orangedcx.com": {
    "passwordHash": "f891e1aa98ea7216c69f6ca702f21bde2b53acf0a836085a98486d92d18f14b1",
    "name": "Luis",
    "active": true,
    "role": "user"
  },
  "mario@orangedcx.com": {
    "passwordHash": "15c1dbb20c76937f9614902aef2d19c715485ec76fc905d4f03e0486a4649226",
    "name": "Mario",
    "active": true,
    "role": "user"
  },
  "melissa@orangedcx.com": {
    "passwordHash": "067af43506b75990bb3e11cbfa549b661857462c9822ecb6dd077fedf6c9b023",
    "name": "Melissa",
    "active": true,
    "role": "user"
  },
  "miguel@orangedcx.com": {
    "passwordHash": "ef85b75ab3984e17952742777756646e9a5c16f9de6c347e0492dce61e58e856",
    "name": "Miguel",
    "active": true,
    "role": "user"
  },
  "mperez@orangedcx.com": {
    "passwordHash": "f32152c788f3f6beb6555590f7a1342d86b81c9c60d4fd20e3382bcc8d136cab",
    "name": "Mperez",
    "active": true,
    "role": "user"
  },
  "montserrat@orangedcx.com": {
    "passwordHash": "0df9f11d33bef85949270bb7e47215ea3b5d793583bd7ba2fab7eebb18979177",
    "name": "Montserrat",
    "active": true,
    "role": "user"
  },
  "mxochipa@orangedcx.com": {
    "passwordHash": "fc84470aaef2e0d3cb686dfb18857050a17ad53b727019e3206a35677f878134",
    "name": "Mxochipa",
    "active": true,
    "role": "user"
  },
  "moises@orangedcx.com": {
    "passwordHash": "bae7fc13e108301d8f997b95fe7c816c3c0692e2c7a05176a462cd45c185eb0c",
    "name": "Moises",
    "active": true,
    "role": "user"
  },
  "myriam@orangedcx.com": {
    "passwordHash": "6a523e546f310c9777161c216906ab6b46c6a46a530c0d1454ce780f7accca2c",
    "name": "Myriam",
    "active": true,
    "role": "user"
  },
  "nicole@orangedcx.com": {
    "passwordHash": "c8fb720617e353b3008a0e0621d4f5a150242e9842f828dd627abcde3f0f5d44",
    "name": "Nicole",
    "active": true,
    "role": "user"
  },
  "oscar@orangedcx.com": {
    "passwordHash": "8171f2ce00432d3b40d1f81b8f2541f67fd1694b1156282b1835630dbed2768d",
    "name": "Oscar",
    "active": true,
    "role": "user"
  },
  "pablo@orangedcx.com": {
    "passwordHash": "c3750b4386e3fd8190da9bd2863d5a90ed4eb5c21239cc03cfeda483385ee351",
    "name": "Pablo",
    "active": true,
    "role": "user"
  },
  "patricia@orangedcx.com": {
    "passwordHash": "f82d5a15f13bfeb3eee49980d9e7131692ea964d71174389e71da9b43c3150d0",
    "name": "Patricia",
    "active": true,
    "role": "user"
  },
  "regina@orangedcx.com": {
    "passwordHash": "453d35f3d8125a4793557555f503e61f4dea8bc6091be32a637d207d4234338d",
    "name": "Regina",
    "active": true,
    "role": "user"
  },
  "rodrigo@orangedcx.com": {
    "passwordHash": "797ce1c457556a58808636eee05e4e802f148f5d168fc28cb471ea963aa759b2",
    "name": "Rodrigo",
    "active": true,
    "role": "user"
  },
  "roberta@orangedcx.com": {
    "passwordHash": "76a806697cac7e43a588587fe05156f8332e8fb0644ddd88de05a24da7fa695d",
    "name": "Roberta",
    "active": true,
    "role": "user"
  },
  "srincon@orangedcx.com": {
    "passwordHash": "d977d47394ed700d33b6172e6916987796d74e5563eeb8b115372555a5da08de",
    "name": "Srincon",
    "active": true,
    "role": "user"
  },
  "sofia@orangedcx.com": {
    "passwordHash": "6f704b1a7098089c278c1493261ba3060ada7c3674f98cb5ca28d67b9f63f4a3",
    "name": "Sofia",
    "active": true,
    "role": "user"
  },
  "viridiana.b@orangedcx.com": {
    "passwordHash": "2f48d1325aa568cb14363aed4e75667266664476ffbea81403ac2b6cbc47c809",
    "name": "Viridiana B",
    "active": true,
    "role": "user"
  },
  "avargas@orangedcx.com": {
    "passwordHash": "20a9ad30ff9b42d74639f63d03dbc2e41610493a93f8b2bdeca7a61338a461c1",
    "name": "Avargas",
    "active": true,
    "role": "user"
  },
  "yareth@orangedcx.com": {
    "passwordHash": "563167cba94c90113157d22e76d7ff69bcec8298de834c0cf443daffadb9f5fa",
    "name": "Yareth",
    "active": true,
    "role": "user"
  },
  "fernand@orangedcx.com": {
    "passwordHash": "1991712590fc1802324c813b3a73a89c082e67990a8183fc0dcfa51b19516809",
    "name": "Fernand",
    "active": true,
    "role": "user"
  },
  "adrian@fanxp.digital": {
    "passwordHash": "9dbd69907976fabb35c868659b18da4f8113987f04b797dfc5d249d02019c30a",
    "name": "Adrian",
    "active": true,
    "role": "user"
  },
  "aidee@fanxp.digital": {
    "passwordHash": "f0706cae5467a8bdcd0c381ef09426c406f0eabb4a86bcc43dc0b4b532377cb9",
    "name": "Aidee",
    "active": true,
    "role": "user"
  },
  "ana@fanxp.digital": {
    "passwordHash": "f1e4191303fff34b3f4024b13d0a4e145073300712aa96aa09cde0e68b241fcb",
    "name": "Ana",
    "active": true,
    "role": "user"
  },
  "hector@fanxp.digital": {
    "passwordHash": "31b1d26bb9f381157d68c8eacb6b58fe71e262708c6967d43eb133fa96dd282e",
    "name": "Hector",
    "active": true,
    "role": "user"
  },
  "jluna@fanxp.digital": {
    "passwordHash": "6d7803324c481ad3349171bf46d2e1f7d935c50cd1f8f4917a74e89845b08428",
    "name": "Jluna",
    "active": true,
    "role": "user"
  },
  "luciana@fanxp.digital": {
    "passwordHash": "aa1218d1e53d691d7b06151fe1aa2d615b0270d585b1baeb276e325a78a4d5ac",
    "name": "Luciana",
    "active": true,
    "role": "user"
  },
  "martin@fanxp.digital": {
    "passwordHash": "0f9a57dccba68fad4656d0209512305563e5bf77a50e3463b0c246f9484b1237",
    "name": "Martin",
    "active": true,
    "role": "user"
  },
  "usiel@fanxp.digital": {
    "passwordHash": "f2f41e5e929dd8c6fbfdf96d6c4ce353b1ede7f3e53a417757e36388bf50ff05",
    "name": "Usiel",
    "active": true,
    "role": "user"
  },
  "zamahara@fanxp.digital": {
    "passwordHash": "256dbd72b5ba4bc8b9388b3b0aa1713d526c0cf95ba173537b7111153e8f6e52",
    "name": "Zamahara",
    "active": true,
    "role": "user"
  },
  "analucette@orangedcx.com": {
    "passwordHash": "35170c59f4940383dd0d560da46ab2aced828e241350abfc20149e38c9da58e4",
    "name": "Analucette",
    "active": true,
    "role": "user"
  },
  "rvillarreal@orangedcx.com": {
    "passwordHash": "dab302691061c2298248a5970d172ad2a1e4ef64b140784b597e335c6ed74e6b",
    "name": "Rvillarreal",
    "active": true,
    "role": "user"
  },
  "usiel@orangedcx.com": {
    "passwordHash": "2f2f2aa9a9ac0c2d9252e23b5e7ff6df6470a5469334532d4912859a38b03852",
    "name": "Usiel",
    "active": true,
    "role": "user"
  }
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.AUTH_SALT).digest('hex');
}

function generateToken(username, userData) {
  const payload = {
    username: username,
    name: userData.name,
    role: userData.role,
    auth: true,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Username and password required" }),
      };
    }

    // Check if environment variables are set
    if (!process.env.AUTH_SALT) {
      console.error("Missing environment variable: AUTH_SALT");
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Check if user exists
    const userData = USERS_DB[username.toLowerCase()];
    if (!userData) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    // Check if user is active
    if (!userData.active) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Account disabled" }),
      };
    }

    // Verify password
    const hashedInput = hashPassword(password);
    
    if (hashedInput === userData.passwordHash) {
      const token = generateToken(username, userData);
      const expires = Date.now() + (24 * 60 * 60 * 1000);
      
      // Log successful login (for admin tracking)
      console.log(`✅ Login successful: ${username} (${userData.name}) at ${new Date().toISOString()}`);
      
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          token: token,
          expires: expires,
          user: {
            username: username,
            name: userData.name,
            role: userData.role
          }
        }),
      };
    } else {
      // Log failed login attempt
      console.log(`❌ Login failed: ${username} at ${new Date().toISOString()}`);
      
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
