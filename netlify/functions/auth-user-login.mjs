// netlify/functions/auth-user-login.mjs
import crypto from 'crypto';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// User database - In production, this could be moved to a file or external service
const USERS_DB = {
"rodrigo@orangedcx.com": {
"passwordHash": "6660611f80f610cf7793ad0eb706336e4d1f1bb5668a59e68d2df155fb808f0c",
"name": "Rodrigo",
"active": true,
"role": "user"
},
"abraham@orangedcx.com": {
"passwordHash": "8a2632e81b99da62079a66e5b452d0f8613069aaa446ef065c7b14a64899c0f6",
"name": "Abraham",
"active": true,
"role": "user"
},
"alfredo@orangedcx.com": {
"passwordHash": "f45e62dec19ff6a7f13017ee597b322a78c9ef06c0ab1c940acc5aadbf35de0b",
"name": "Alfredo",
"active": true,
"role": "user"
},
"alexa@orangedcx.com": {
"passwordHash": "8bd74eab39c1170dcca01d78ad49a47420a69be1cede694d032042c9e5e36040",
"name": "Alexa",
"active": true,
"role": "user"
},
"alejandra@orangedcx.com": {
"passwordHash": "501255910c51c1ef335c44fd477ab8b9764be8a7a8a72291a251e7bc495a45fc",
"name": "Alejandra",
"active": true,
"role": "user"
},
"alejandro@orangedcx.com": {
"passwordHash": "78fc31719df86398d1d449c8affece9b30825571a1452d920cc6403c48d5807d",
"name": "Alejandro",
"active": true,
"role": "user"
},
"alexis@orangedcx.com": {
"passwordHash": "5d2423c210aaef351ae02b22ef31702ad81f4a83be5d815fc9757b57dcbcf343",
"name": "Alexis",
"active": true,
"role": "user"
},
"asalcedo@orangedcx.com": {
"passwordHash": "0618737505588c2ce718b3da8666981c8e22ec0b08d8a5d7efc0cbb2678b1bc9",
"name": "Asalcedo",
"active": true,
"role": "user"
},
"alma@orangedcx.com": {
"passwordHash": "7fe2c4bfd8cb50d378fad3869f69d2100daf831391ac17c3556cf40a9776eac3",
"name": "Alma",
"active": true,
"role": "user"
},
"alonso@orangedcx.com": {
"passwordHash": "ecf806fde72a70c4c409c0aa88cf652098d904eabd274fd023fca708721e0c13",
"name": "Alonso",
"active": true,
"role": "user"
},
"ana.robledo@orangedcx.com": {
"passwordHash": "a120651a615f10d7a3cf67c8b20d8a687b189a2603497144985a1018c522ea6a",
"name": "Ana Robledo",
"active": true,
"role": "user"
},
"andrea@orangedcx.com": {
"passwordHash": "4e7916bde9ca91513220f01bd5a9d3b6aaae35475cf158abae554e8cd844ff51",
"name": "Andrea",
"active": true,
"role": "user"
},
"acaceres@orangedcx.com": {
"passwordHash": "396a1c3b248ca955fb1a4027c4fc6782a657e03a04905c8d28d7e2ac91b94cda",
"name": "Acaceres",
"active": true,
"role": "user"
},
"arlette@orangedcx.com": {
"passwordHash": "3c209d522f02eea0601b629b5569e6f7efb2ce61d5ba17f2778d8bdf073cc65d",
"name": "Arlette",
"active": true,
"role": "user"
},
"belen.benegas@orangedcx.com": {
"passwordHash": "a59a0e1f50b01724f1114edd1639245465ce62ed056b7af99e3fb857c7be07ee",
"name": "Belen Benegas",
"active": true,
"role": "user"
},
"jesus@orangedcx.com": {
"passwordHash": "13b8095bd1f6d818229f9918d3865e5ff72b59975dcd48d405fc9e6356e68fc3",
"name": "Jesus",
"active": true,
"role": "user"
},
"cperez@orangedcx.com": {
"passwordHash": "36ab7a23a7ef80948c99c52ebddf3b1632c647512113c0cf5664ba2ff6fee5f9",
"name": "Cperez",
"active": true,
"role": "user"
},
"cesar@orangedcx.com": {
"passwordHash": "478b9371b8a16e73344ff1ab56a2c10620ca154c487b1d123b70deaedc12d864",
"name": "Cesar",
"active": true,
"role": "user"
},
"antonio@orangedcx.com": {
"passwordHash": "2134735cc1d5e4fcfe6ec7d17cb3086c25bd74cce2b9dd13ad337e2d1472ee2f",
"name": "Antonio",
"active": true,
"role": "user"
},
"daira@orangedcx.com": {
"passwordHash": "1db3eb4715b8ddf5d8bb31ba9c61cb76dfdb39498916a1a1c47c254c2e26b718",
"name": "Daira",
"active": true,
"role": "user"
},
"daniel@orangedcx.com": {
"passwordHash": "f84229e6497a3de9342948bffe3de07931bb38d536388ebbd465c18703556e67",
"name": "Daniel",
"active": true,
"role": "user"
},
"diana@orangedcx.com": {
"passwordHash": "67543c383b07d68c5cebfe35fb781d3b3500cc3ad07a5015af951c1d45479458",
"name": "Diana",
"active": true,
"role": "user"
},
"diego@fanxp.digital": {
"passwordHash": "48628946f4b19dc05504fe8b09fae381047ed7be683843e6410d9db3d2d88673",
"name": "Diego",
"active": true,
"role": "user"
},
"elena@orangedcx.com": {
"passwordHash": "d044c5980af63b61891bf025f96a26533fde32836e227a0d7017cbe0ea6240e2",
"name": "Elena",
"active": true,
"role": "user"
},
"elizabeth@orangedcx.com": {
"passwordHash": "fbab4d73a0ad50675844474e7e2130593855d342d844cf3524cec7a7caa4ffb2",
"name": "Elizabeth",
"active": true,
"role": "user"
},
"emiliano@orangedcx.com": {
"passwordHash": "c94ac6ab8c596562a5842eb3b5aad690da043d1e89c9bcf653fffac29f479177",
"name": "Emiliano",
"active": true,
"role": "user"
},
"enrique@orangedcx.com": {
"passwordHash": "fdfea132ca28fff4ec8b1c2c77d23b7f9edf9cc43eee43da13e80008f1a2507b",
"name": "Enrique",
"active": true,
"role": "user"
},
"erika@orangedcx.com": {
"passwordHash": "2510b300259a9da1eb5d9a94b5add4056a9901c5fa8e824c24837562c8999715",
"name": "Erika",
"active": true,
"role": "user"
},
"emelendez@orangedcx.com": {
"passwordHash": "3693df9b1caca7daecdcb3fe7dc90c98094f0c1410909b1e15710c0bfa350741",
"name": "Emelendez",
"active": true,
"role": "user"
},
"esperanza@orangedcx.com": {
"passwordHash": "082ec850a5c7a4935b5f4f5b173e187839445f513fee7ebffd05f064f5e92562",
"name": "Esperanza",
"active": true,
"role": "user"
},
"fabricio@orangedcx.com": {
"passwordHash": "b6a27b4b03c09c858877da0b282c82156bf009da3367378ce40648f7ea6c7fa6",
"name": "Fabricio",
"active": true,
"role": "user"
},
"facundo@orangedcx.com": {
"passwordHash": "7d615760d3f4977e69ef7bb9f751b4df5170b1854b630b481a18ddbccc6ba9f0",
"name": "Facundo",
"active": true,
"role": "user"
},
"felipe@orangedcx.com": {
"passwordHash": "eaf5ba3f457b2d63ca669765deb383e67feb8e7b13d4b9b541c076cd6d6be23e",
"name": "Felipe",
"active": true,
"role": "user"
},
"ggonzalez@orangedcx.com": {
"passwordHash": "b1989c3482991431fa06a54abe53f0cfa614e3e32a4be408c7b9c4b220ba475c",
"name": "Ggonzalez",
"active": true,
"role": "user"
},
"genesis@orangedcx.com": {
"passwordHash": "7bd617b160cfed5efef3121a565c0392bdcd09c0cbf075ea870c445b6410f44a",
"name": "Genesis",
"active": true,
"role": "user"
},
"grecia@orangedcx.com": {
"passwordHash": "f05e04be9e745166329af55632f553e17cfc93e3245b031d7bce81cf6ac6e1ff",
"name": "Grecia",
"active": true,
"role": "user"
},
"gregorio@orangedcx.com": {
"passwordHash": "8d9632892db3d3cd1e2b8ecb70e0a411cc19e1c0b8fe4408567d24c9a9b79af3",
"name": "Gregorio",
"active": true,
"role": "user"
},
"ghernandez@orangedcx.com": {
"passwordHash": "b18455f8483709548f5d7dd15cd0b59f2541a75bdd57fff0f2ddcd9d37fba798",
"name": "Ghernandez",
"active": true,
"role": "user"
},
"hgarcia@orangedcx.com": {
"passwordHash": "11d43a1544ebe6261b7af49e3340a481286af2f91680b5b4979247420708fdb4",
"name": "Hgarcia",
"active": true,
"role": "user"
},
"hernan@orangedcx.com": {
"passwordHash": "ed30f294b95b981c012bd06533a839ad404a0612c6c6fd0f170d93116ce4b22a",
"name": "Hernan",
"active": true,
"role": "user"
},
"hector@orangedcx.com": {
"passwordHash": "d39de1c9a40c14695fa0b5731bb2fcf696e675755376fbf64d6dbcf1fcd75251",
"name": "Hector",
"active": true,
"role": "user"
},
"irving@orangedcx.com": {
"passwordHash": "69c06b754bd0da26f027f3a18ce4dae7ace9288a7c894e9e3eba24b6a04a1d54",
"name": "Irving",
"active": true,
"role": "user"
},
"isaac@orangedcx.com": {
"passwordHash": "6903ad13d59105af26f3092ba6bef6a90974b257ae7ed9583f91aa2f0d161799",
"name": "Isaac",
"active": true,
"role": "user"
},
"jennifer@orangedcx.com": {
"passwordHash": "aa8ab12285fd5b7b58fa459c34e6f56fca077d8c3f5ad4fe47bb71ec8ef562e8",
"name": "Jennifer",
"active": true,
"role": "user"
},
"jmonjiote@orangedcx.com": {
"passwordHash": "a15941c78b1c010dce5faa12a229cc1310aabf57ece744e24c52de4a0370f082",
"name": "Jmonjiote",
"active": true,
"role": "user"
},
"joel@orangedcx.com": {
"passwordHash": "ee5a14dfe299a451fa0673b1e75100587cc8117fd3d8cb6654889bc11907f292",
"name": "Joel",
"active": true,
"role": "user"
},
"julian.m@orangedcx.com": {
"passwordHash": "e0b74f031422e7bc65511bc627d8adc14e44ef18b2b4b72141b82b649b353c6c",
"name": "Julian M",
"active": true,
"role": "user"
},
"julieta@orangedcx.com": {
"passwordHash": "18e5c8aea61f5032a06496e3dcc0c4716ad62de8cdbef223fe82b434638f8480",
"name": "Julieta",
"active": true,
"role": "user"
},
"karen@orangedcx.com": {
"passwordHash": "4d4fb8c7b37d53d372906b7854675db2dc485d50b5231a6fb51bb4dea13345e3",
"name": "Karen",
"active": true,
"role": "user"
},
"karina@orangedcx.com": {
"passwordHash": "ff00e312d5765cb10b89381af8f9476d0786ff3993d3e19cd2ac9adf32c500ac",
"name": "Karina",
"active": true,
"role": "user"
},
"kimberling@orangedcx.com": {
"passwordHash": "42ac5f489d2415720c75c9a5d2b6897ba85e8255b2f0ecf3a70fefbec2cad21e",
"name": "Kimberling",
"active": true,
"role": "user"
},
"liseth@orangedcx.com": {
"passwordHash": "cc181b1f67373c2fc0bda132f865b65e06dfe8fc187968b404078cf8e1a54d4b",
"name": "Liseth",
"active": true,
"role": "user"
},
"lucyana@orangedcx.com": {
"passwordHash": "63eceb4a1f72312bbe24ce67ca7398bddcc68eb8623d14b8829f666ae653d1c9",
"name": "Lucyana",
"active": true,
"role": "user"
},
"luis@orangedcx.com": {
"passwordHash": "0cec584d9fa4dd0cd666b1330e837c5656c7b909fe88eb5c81ca17e0a506f23e",
"name": "Luis",
"active": true,
"role": "user"
},
"mario@orangedcx.com": {
"passwordHash": "5b1aadfd3d60f783d60ce2e4be84b6d1a0f3811515ef68817265868d9f69ac6a",
"name": "Mario",
"active": true,
"role": "user"
},
"melissa@orangedcx.com": {
"passwordHash": "a5f6d0852e80442984039e4dff32830f1b5bf74c1278ab93a9e7ddf113dfa631",
"name": "Melissa",
"active": true,
"role": "user"
},
"miguel@orangedcx.com": {
"passwordHash": "7bb0d29f6d03f4407299d83391c0826b023fa65ebb2d8fc3853d57e266760349",
"name": "Miguel",
"active": true,
"role": "user"
},
"mperez@orangedcx.com": {
"passwordHash": "7ebd4c116f77675420c9afdbabdee502dc4db1112701629acaac4239e49f96c3",
"name": "Mperez",
"active": true,
"role": "user"
},
"montserrat@orangedcx.com": {
"passwordHash": "793efcaae79e02656c83e312469ec4e6fe157258d1a1d100c589c7bfd332a167",
"name": "Montserrat",
"active": true,
"role": "user"
},
"mxochipa@orangedcx.com": {
"passwordHash": "4c4df319e975295c1406e406c807830db247a5cfbecb6f24e7f9c7154c2953ba",
"name": "Mxochipa",
"active": true,
"role": "user"
},
"moises@orangedcx.com": {
"passwordHash": "7cd83e8e9525b52ef65fb109181261ac7bc12e4f289466ae43467bf486fd925a",
"name": "Moises",
"active": true,
"role": "user"
},
"myriam@orangedcx.com": {
"passwordHash": "08abc9030e5b8262c1c715ae1547458ae23a1715476aae881369f67371b87e09",
"name": "Myriam",
"active": true,
"role": "user"
},
"nicole@orangedcx.com": {
"passwordHash": "749b5441262544e8ccf0590fe7efa010f2fe06c5a9cf2718e4e742b739f28951",
"name": "Nicole",
"active": true,
"role": "user"
},
"oscar@orangedcx.com": {
"passwordHash": "4ccaead7941e9de8758bd062990dee7ecdc5b0e128135bcb357f6d79302368e9",
"name": "Oscar",
"active": true,
"role": "user"
},
"pablo@orangedcx.com": {
"passwordHash": "a3708337d8ea87f5724a63929e1d295a5871812389abc48668e1d51988544ca6",
"name": "Pablo",
"active": true,
"role": "user"
},
"patricia@orangedcx.com": {
"passwordHash": "561a8160644ec60f5ce250fd4580ab22fced47c3f0acdafb1cdec8ed0f4833ee",
"name": "Patricia",
"active": true,
"role": "user"
},
"regina@orangedcx.com": {
"passwordHash": "e8f03ebeb45b74c4dd10ed4e4f670c2e37e2b5a3052ae207db9cd1375a618256",
"name": "Regina",
"active": true,
"role": "user"
},
"roberta@orangedcx.com": {
"passwordHash": "e6423f13bb6c4c98ce0afa1ecc4c4eec5b0e278d3000d787d35c84ae17c16db3",
"name": "Roberta",
"active": true,
"role": "user"
},
"srincon@orangedcx.com": {
"passwordHash": "095f25eb2e16ba29234df1a347a560d8b36b10bbc69ed8c93717f7f425d8a648",
"name": "Srincon",
"active": true,
"role": "user"
},
"sofia@orangedcx.com": {
"passwordHash": "5e27fcb13e239a333de03485892461b14952f8176e291dc20b9caf55130392c0",
"name": "Sofia",
"active": true,
"role": "user"
},
"viridiana.b@orangedcx.com": {
"passwordHash": "0bc3803b96a792393bea7d3950c31e472647dbfc7937e525556f54f88e30a2b4",
"name": "Viridiana B",
"active": true,
"role": "user"
},
"avargas@orangedcx.com": {
"passwordHash": "85aa24bed248dca01954e0a0c39b9e71841f557a41e6365a96cf52f37e839437",
"name": "Avargas",
"active": true,
"role": "user"
},
"yareth@orangedcx.com": {
"passwordHash": "cfe808d0f0ceeb2faa51647bca7e5600196d4a9a8f71ac26cd8b9542d0789b27",
"name": "Yareth",
"active": true,
"role": "user"
},
"fernand@orangedcx.com": {
"passwordHash": "c1dd3c853526c2482b246f166162403af0daf59f3a8148d2a0608d78c786e017",
"name": "Fernand",
"active": true,
"role": "user"
},
"adrian@fanxp.digital": {
"passwordHash": "4e39ff2cde0c3ee2a86e1a3d2e88775c7fc59df367c7be75cafa2c1cbf7cbc27",
"name": "Adrian",
"active": true,
"role": "user"
},
"aidee@fanxp.digital": {
"passwordHash": "b6aa0bd9e8b17aade82d2cc1447347793d01acb8570d68e7e01fc843c7b86c58",
"name": "Aidee",
"active": true,
"role": "user"
},
"ana@fanxp.digital": {
"passwordHash": "e5b2e303a6746b9253532ac702e3a294ae3a3c3eb537d72b5147404bc1c193ff",
"name": "Ana",
"active": true,
"role": "user"
},
"hector@fanxp.digital": {
"passwordHash": "d39de1c9a40c14695fa0b5731bb2fcf696e675755376fbf64d6dbcf1fcd75251",
"name": "Hector",
"active": true,
"role": "user"
},
"jluna@fanxp.digital": {
"passwordHash": "85cf4acfbfa83cc056c4a3b656aad5e69e1756d51978550ecf551de5e3a0feec",
"name": "Jluna",
"active": true,
"role": "user"
},
"luciana@fanxp.digital": {
"passwordHash": "3f7e8d08dfd3bd6772d0b6ba41a9c63a18c7df6195f04870714f343d37d265f7",
"name": "Luciana",
"active": true,
"role": "user"
},
"martin@fanxp.digital": {
"passwordHash": "1c94aea7a159af27d28c9d8ecf854c1f5d83858cec5565a66588737046799c1f",
"name": "Martin",
"active": true,
"role": "user"
},
"usiel@fanxp.digital": {
"passwordHash": "9bc0435f6fc7421c8cdafce565757379d1538a7d8ebea1fc279de8fe9b85557e",
"name": "Usiel",
"active": true,
"role": "user"
},
"zamahara@fanxp.digital": {
"passwordHash": "2570b9f8ca38781c1bfca93c6e0089a9d79f69b4011ae8393905e52821874a10",
"name": "Zamahara",
"active": true,
"role": "user"
},
"analucette@orangedcx.com": {
"passwordHash": "76918a926d7341e616f5dd419b7633dd71beb2357590658ed264939d81b3293f",
"name": "Analucette",
"active": true,
"role": "user"
},
"rvillarreal@orangedcx.com": {
"passwordHash": "41bf6042923cc880e687c39488ada8ab689d2d3beff5d6b72e88e6fd96e66828",
"name": "Rvillarreal",
"active": true,
"role": "user"
},
"usiel@orangedcx.com": {
"passwordHash": "9bc0435f6fc7421c8cdafce565757379d1538a7d8ebea1fc279de8fe9b85557e",
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
