import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">{title}</h1>
            <p className="text-gray-600">This is a placeholder for the {title} page.</p>
        </div>
    );
};

export default PlaceholderPage;
