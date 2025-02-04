import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import Input from '../../Input/Input';
import FormButton from '../../FormButton/FormButton';

const Step3 = ({ description, setDescription, setStep }) => {
  // console.log({description})
  const { isConnected, chain, address } = useAccount();

  // variables
  const [logoUrl, setlogoUrl] = useState(description.logoUrl || '');
  const [website, setWebsite] = useState(description.website || '');
  const [facebook, setFacebook] = useState(description.facebook || '');
  const [twitter, setTwitter] = useState(description.twitter || '');
  const [github, setGithub] = useState(description.github || '');
  const [telegram, setTelegram] = useState(description.telegram || '');
  const [instagram, setInstagram] = useState(description.instagram || '');
  const [discord, setDiscord] = useState(description.discord || '');
  const [reddit, setReddit] = useState(description.reddit || '');
  const [youtube, setYoutube] = useState(description.youtube || '');
  const [whitelistLink, setWhitelistLink] = useState(description.whitelistLink || '');
  const [tokenDescription, setTokenDescription] = useState(description.tokenDescription || '');

  // errors
  const [logoUrlError, setlogoUrlError] = useState(logoUrl == '' ? 'null' : null);
  const [websiteError, setWebsiteError] = useState(website == '' ? 'null' : null);
  const [facebookError, setFacebookError] = useState(null);
  const [twitterError, setTwitterError] = useState(null);
  const [githubError, setGithubError] = useState(null);
  const [telegramError, setTelegramError] = useState(null);
  const [instagramError, setInstagramError] = useState(null);
  const [discordError, setDiscordError] = useState(null);
  const [redditError, setRedditError] = useState(null);
  const [youtubeError, setYoutubeError] = useState(null);
  const [whitelistLinkError, setWhitelistLinkError] = useState(null);
  const [tokenDescriptionError, setTokenDescriptionError] = useState(null);

  // console.log(
  //   {
  //     "errors":
  //       logoUrlError ||
  //       websiteError ||
  //       facebookError ||
  //       twitterError ||
  //       githubError ||
  //       telegramError ||
  //       instagramError ||
  //       discordError ||
  //       redditError ||
  //       youtubeError ||
  //       whitelistLinkError ||
  //       tokenDescriptionError
  //   })

  // Utility function to validate URL
  const isValidUrl = (value) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
    );
    return !!urlPattern.test(value);
  };

  // Utility function to validate image extensions
  const isValidImageExtension = (value) => {
    const imagePattern = /\.(png|jpe?g|gif)$/i;
    return imagePattern.test(value);
  };

  const handleLogoUrl = (value) => {
    if (!value) {
      setlogoUrlError('Logo URL should not be empty!!!!');
    } else if (!isValidImageExtension(value)) {
      setlogoUrlError('Unsupported image extension. Allowed: png, jpg, jpeg, gif.');
    } else {
      setlogoUrlError(null);
    }
    setlogoUrl(value);
  };

  const handleWebsite = (value) => {
    if (!value) {
      setWebsiteError('Website should not be empty!!!!');
    } else if (!isValidUrl(value)) {
      setWebsiteError('Invalid website URL.');
    } else {
      setWebsiteError(null);
    }
    setWebsite(value);
  };

  const handleFacebook = (value) => {
    if (value && !isValidUrl(value)) {
      setFacebookError('Invalid Facebook URL.');
    } else {
      setFacebookError(null);
    }
    setFacebook(value);
  };

  const handleTwitter = (value) => {
    if (value && !isValidUrl(value)) {
      setTwitterError('Invalid Twitter URL.');
    } else {
      setTwitterError(null);
    }
    setTwitter(value);
  };

  const handleGithub = (value) => {
    if (value && !isValidUrl(value)) {
      setGithubError('Invalid GitHub URL.');
    } else {
      setGithubError(null);
    }
    setGithub(value);
  };

  const handleTelegram = (value) => {
    if (value && !isValidUrl(value)) {
      setTelegramError('Invalid Telegram URL.');
    } else {
      setTelegramError(null);
    }
    setTelegram(value);
  };

  const handleInstagram = (value) => {
    if (value && !isValidUrl(value)) {
      setInstagramError('Invalid Instagram URL.');
    } else {
      setInstagramError(null);
    }
    setInstagram(value);
  };

  const handleDiscord = (value) => {
    if (value && !isValidUrl(value)) {
      setDiscordError('Invalid Discord URL.');
    } else {
      setDiscordError(null);
    }
    setDiscord(value);
  };

  const handleReddit = (value) => {
    if (value && !isValidUrl(value)) {
      setRedditError('Invalid Reddit URL.');
    } else {
      setRedditError(null);
    }
    setReddit(value);
  };

  const handleYoutube = (value) => {
    if (value && !isValidUrl(value)) {
      setYoutubeError('Invalid YouTube URL.');
    } else {
      setYoutubeError(null);
    }
    setYoutube(value);
  };

  const handleWhitelistLink = (value) => {
    if (value && !isValidUrl(value)) {
      setWhitelistLinkError('Invalid whitelist link URL.');
    } else {
      setWhitelistLinkError(null);
    }
    setWhitelistLink(value);
  };

  const handleTokenDescription = (value) => {
    if (value && value.length < 128) {
      setTokenDescriptionError('Minimum length of description should be more than 128 !!!!');
    } else {
      setTokenDescriptionError(null);
    }
    setTokenDescription(value);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  }

  const handleNext = () => {
    setDescription((prevDescription) => ({
      ...prevDescription,
      logoUrl,
      website,
      facebook,
      twitter,
      github,
      telegram,
      instagram,
      discord,
      reddit,
      youtube,
      whitelistLink,
      tokenDescription,
    }));
    setStep((prevStep) => prevStep + 1);
  }

  if (!isConnected || chain?.nativeCurrency.name !== description.choosenChain || address !== description.choosenAccount) {
    return <div>
      <center className="text-danger">
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only"></span>
        </div><br />
        You chose {description.choosenChain} and {description.choosenAccount} chain in Step 1. The verification of token was done for the same.<br />
        Either switch to {description.choosenChain} and {description.choosenAccount} or reload to start again!!!!
      </center>
    </div>;
  }
  return (
    <>
      <Input
        label={"Logo URL*"}
        type={"text"}
        placeholder={"Enter logo URL"}
        value={logoUrl}
        onChange={(e) => handleLogoUrl(e.target.value)}
        note={`URL must end with a supported image extension png, jpg, jpeg, or gif.`}
        error={logoUrlError != 'null' && <Form.Text className="text-danger">{logoUrlError}</Form.Text>}
      />

      <Input
        label={"Website*"}
        type={"url"}
        placeholder={"Enter website URL"}
        value={website}
        onChange={(e) => handleWebsite(e.target.value)}
        error={websiteError != 'null' && <Form.Text className="text-danger">{websiteError}</Form.Text>}
      />

      <Input
        label={"Facebook"}
        type={"url"}
        placeholder={"Enter Facebook URL"}
        value={facebook}
        onChange={(e) => handleFacebook(e.target.value)}
        error={facebookError != 'null' && <Form.Text className="text-danger">{facebookError}</Form.Text>}
      />

      <Input
        label={"Twitter"}
        type={"url"}
        placeholder={"Enter Twitter URL"}
        value={twitter}
        onChange={(e) => handleTwitter(e.target.value)}
        error={twitterError != 'null' && <Form.Text className="text-danger">{twitterError}</Form.Text>}
      />

      <Input
        label={"Github"}
        type={"url"}
        placeholder={"Enter Github URL"}
        value={github}
        onChange={(e) => handleGithub(e.target.value)}
        error={githubError != 'null' && <Form.Text className="text-danger">{githubError}</Form.Text>}
      />

      <Input
        label={"Telegram"}
        type={"url"}
        placeholder={"Enter Telegram URL"}
        value={telegram}
        onChange={(e) => handleTelegram(e.target.value)}
        error={telegramError != 'null' && <Form.Text className="text-danger">{telegramError}</Form.Text>}
      />

      <Input
        label={"Instagram"}
        type={"url"}
        placeholder={"Enter Instagram URL"}
        value={instagram}
        onChange={(e) => handleInstagram(e.target.value)}
        error={instagramError != 'null' && <Form.Text className="text-danger">{instagramError}</Form.Text>}
      />

      <Input
        label={"Discord"}
        type={"url"}
        placeholder={"Enter Discord URL"}
        value={discord}
        onChange={(e) => handleDiscord(e.target.value)}
        error={discordError != 'null' && <Form.Text className="text-danger">{discordError}</Form.Text>}
      />

      <Input
        label={"Reddit"}
        type={"url"}
        placeholder={"Enter Reddit URL"}
        value={reddit}
        onChange={(e) => handleReddit(e.target.value)}
        error={redditError != 'null' && <Form.Text className="text-danger">{redditError}</Form.Text>}
      />

      <Input
        label={"Youtube"}
        type={"url"}
        placeholder={"Enter Youtube URL"}
        value={youtube}
        onChange={(e) => handleYoutube(e.target.value)}
        error={youtubeError != 'null' && <Form.Text className="text-danger">{youtubeError}</Form.Text>}
      />

      <Input
        label={"Whitelist Link"}
        type={"url"}
        placeholder={"Enter whitelist link URL"}
        value={whitelistLink}
        onChange={(e) => handleWhitelistLink(e.target.value)}
        error={whitelistLinkError != 'null' && <Form.Text className="text-danger">{whitelistLinkError}</Form.Text>}
      />

      <Input
        label={"Description"}
        type={"textarea"}
        rows={3}
        placeholder={"Enter description"}
        value={tokenDescription}
        onChange={(e) => handleTokenDescription(e.target.value)}
        error={tokenDescriptionError != 'null' && <Form.Text className="text-danger">{tokenDescriptionError}</Form.Text>}
      />
      <Button variant="secondary" onClick={handlePrevious} className="me-2">
        Previous
      </Button>
      <FormButton
        onClick={handleNext}
        disabled={(logoUrlError ||
          websiteError ||
          facebookError ||
          twitterError ||
          githubError ||
          telegramError ||
          instagramError ||
          discordError ||
          redditError ||
          youtubeError ||
          whitelistLinkError ||
          tokenDescriptionError)}
        buttonName={"Next"}
      />
    </>
  )
};

export default Step3;
