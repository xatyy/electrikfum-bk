const privkey = "-----BEGIN RSA PRIVATE KEY-----\n"+
"MIIEpAIBAAKCAQEA1dS7su8Ph8zdGPl/Q67pHJwxF/UsSjEVHh7DptNoxiy0cAyW\n"+
"NsbWHX4Z6De1b/07174ACrGjUr7d7eY/dXp2AM6u031Cr8jaQjgyqjK3bpIt2Pb1\n"+
"t08ASfu3Vpz2Lo0aOOAcUOMP6n4U+qCQN1mDc2gaEdpmNlAaDkJR+s7ycnmOvAZ8\n"+
"eXWSTL4CXMDDlonj6U7mzu8Da7SroLt428ofcbEFAVL5bY2RoQYYCc5bnZMlu1oz\n"+
"VtA41F4OQ7Hn1JACG3yu5gr7KYkyv32aAYVFTqR8jVo2Zy8jgHla0yokSE32SczX\n"+
"YPV+FHqd2Z14CRyfk1tkhgGeBd3e4tZTtFX2twIDAQABAoIBAQCKl4hUkGfDf/+p\n"+
"yUQ4LS0AEygqvAjJyYhDbnMnNI0LLTyCB1ZxCG0MzoeiIEFj5YEc8xP52mreHcGg\n"+
"CQUGcqn7GfrsLprDbm4wT1ZfQ+HqM6qtnltiRT0Ntq184N0bDO96/566uoC9Xpzg\n"+
"WKNAjK8LZOTIv4JSH5bTuR6DbhBsKretyUakhJBRdMfMOpA0dVI2dLZSD+9m4pET\n"+
"EE5GQ4NutNwMH3WyeZDp6B7/ne3erTgLk2SNY/JE8iaiHDl+hHl/9ZTZfv4IOQ8I\n"+
"zS+UZMrSLO7lqnsufIN/uWaih0X/1av7aADsZyQjG70bWc31ZwhGew3s8rijpRzv\n"+
"QiEngJ3BAoGBAPY7wzzD3nicSNfVQkPNJx7f9a2Mhw8uHWLjVvQyrzZVRh+Hd+SD\n"+
"Z+ATZcRvK5Ouw6FrBqTz1vmwnb/KNCpetPJM6nZwlGK3tUdSgETe/AwMo9tJge/w\n"+
"fIftqexzP9+og6w1LFosEcRvjVd2x+FBNdqbgrJ/Va0LxZrvPFo644MhAoGBAN5P\n"+
"9U7NOd923wBGf8GTMh4MK2W1Vd7y8we8sPXBgkWaU9hsDSdCtZfJLUH0AfDq20PG\n"+
"K+9v9VZZdyfoVjZ2OTlmtgPKTaiI7Y5ZTHldTpsVuyu1dzPgknkTHwr7M7OKZBsy\n"+
"nDtwly6CHF9+PqVppHoFnBNUHjfA3B7fXPTwPhbXAoGAY2F9jEH1wbI6SDp/k0Py\n"+
"/SghTVmBjWPsYmQlTUxDoWdLdSBFCIrs2uiZU24XJXUM6lJ7DQqJgp+BG85tvYgZ\n"+
"+g2HOCR6D1ncJZwrvyBMlERpwfDqK8BhUq9evNtLNWcbNd8ENqTAywrG/j0nsUeT\n"+
"h9bqKkbwenZc3Aqgzj4kY2ECgYEAx93LBVWsuiL8yhqXsUjMvgbi3UXyNcbmiAY0\n"+
"cj3PCRR+XQyHpsxqxlOvxKPDOv1qs7vutA1L3J4CanaPS9duCxU0fqPavbKdIGVY\n"+
"Q6SHjxYyeFFlIda82O0/83d0O+4noewWWboXsVB4gcHWQJCBttJkR1xQ7n8NZxQZ\n"+
"VnzG1XECgYB0aCPWy1UuvO4C5jQKSCYV07Fp1PogT2mX6GD3Mh4psDTP6SJKddW+\n"+
"tguIQ4pDprHQz/7f0N9n46+l2iMfSb42jZCk/Y+L6V3S+7ojxUNbOzxOsPZFFgBF\n"+
"4Tx5FxOCfbrqavaimjTgl38mlDevmu1iQ8M+trOAljNCjAJoMT97gA==\n"+
"-----END RSA PRIVATE KEY-----\n"
module.exports = ({ env }) => ({
    // ...
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions :{
          host: 'mail.electrikfum.ro',
          port: 465,
          secure: true,
          auth: {
            user: '_mainaccount@electrikfum.ro',
            pass: '*P7F2Xg4wv5x)Z',
          },
        },
        settings: {
          defaultFrom: 'info@electrikfum.ro',
          defaultReplyTo: 'info@electrikfum.ro',
        },
      },
    },
    // ...
  });