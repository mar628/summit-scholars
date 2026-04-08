import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

/**
 * MetaData component for setting up HTML metadata tags dynamically.
 *
 * This component uses the `react-helmet` library to manage the document head,
 * allowing you to set the page title, description, keywords, and other metadata.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.title] - The title of the page, displayed in the browser tab.
 * @param {string} [props.description] - A brief description of the page content for SEO purposes.
 * @param {string} [props.keywords] - A comma-separated list of keywords for SEO purposes.
 *
 * @example
 * <MetaData
 *   title="Home Page"
 *   description="Welcome to the MyClasses Management System"
 *   keywords="MyClasses, prayer times, Islamic events"
 * />
 */
const MetaData = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title || 'Summit Scholars Hub - Online Tutoring'}</title>
      <meta
        name="description"
        content={
          description ||
          'Summit Scholars Hub offers affordable, structured online tutoring for Form 1-4 students in Kenya. KCSE and CBC preparation with qualified tutors.'
        }
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="keywords"
        content={
          keywords ||
          'online tutoring Kenya, KCSE preparation, CBC tutoring, Form 1 to 4 tutoring, secondary school Kenya, Maths tutoring Kenya, Science tutoring Kenya, affordable online tutor Kenya, Summit Scholars Hub'
        }
      />
      <meta name="author" content="Summit Scholars Hub" />
      <meta property="og:type" content="education" />
    </Helmet>
  );
};

MetaData.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.string,
};

export default MetaData;
