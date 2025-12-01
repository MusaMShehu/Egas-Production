import React, { useState, useEffect } from 'react';
import { 
  FaCalendar, 
  FaUser, 
  FaClock,
  FaTag,
  FaFolder,
  FaShare,
  FaHeart,
  FaComment,
  FaArrowLeft,
  FaHome,
  FaArrowRight,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaExclamationTriangle,
  FaFire,
  FaTools,
  FaCog,
  FaIndustry,
  FaLeaf,
  FaBolt
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import './Blog.css';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Complete blog posts data with full content
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Gas Safety Tips Every Homeowner Should Know",
      excerpt: "Learn the crucial safety measures to prevent accidents and ensure safe usage of gas in your home. Our experts share professional advice...",
      content: `
        <h2>Understanding Gas Safety in Your Home</h2>
        <p>Gas safety is paramount for every homeowner. Proper handling and maintenance can prevent accidents and ensure a safe living environment. According to national safety boards, proper gas safety practices can prevent up to 90% of gas-related accidents in homes.</p>
        
        <h3>1. Regular Appliance Maintenance</h3>
        <p>Schedule annual inspections for all gas appliances by qualified technicians. Regular maintenance ensures optimal performance and early detection of potential issues. A well-maintained gas appliance can last up to 15 years and operate 30% more efficiently.</p>
        <ul>
          <li>Annual professional inspection for all gas appliances</li>
          <li>Check for corrosion or wear on connections</li>
          <li>Verify proper burner operation and flame color</li>
          <li>Inspect ventilation systems for blockages</li>
        </ul>
        
        <h3>2. Proper Ventilation</h3>
        <p>Always ensure adequate ventilation when using gas appliances. Never block air vents and keep rooms well-ventilated to prevent carbon monoxide buildup. Carbon monoxide is called the "silent killer" because it's odorless and colorless.</p>
        <div class="article-note">
          <strong>Important:</strong> Always maintain at least 6 inches of clearance around gas appliances for proper airflow.
        </div>
        
        <h3>3. Install Carbon Monoxide Detectors</h3>
        <p>Place CO detectors near sleeping areas and on every level of your home. Test them monthly and replace batteries annually. Modern CO detectors can detect concentrations as low as 30 parts per million.</p>
        
        <h3>4. Know the Signs of Gas Leaks</h3>
        <p>Recognize the distinctive sulfur-like odor added to natural gas. Other signs include hissing sounds, dead vegetation near gas lines, and unexplained physical symptoms like dizziness or nausea.</p>
        <ul>
          <li>Rotten egg smell (added odorant)</li>
          <li>Hissing or whistling sounds near gas lines</li>
          <li>Bubbles in wet areas around gas pipes</li>
          <li>Unusual dead plants or vegetation</li>
        </ul>
        
        <h3>5. Emergency Procedures</h3>
        <p>Know what to do in case of a gas leak: evacuate immediately, don't operate electrical switches, and call emergency services from a safe distance. Never use phones or electronic devices in the vicinity of a suspected leak.</p>
        
        <h3>6. Proper Storage</h3>
        <p>Store gas cylinders upright in well-ventilated areas, away from heat sources and direct sunlight. Keep them secured to prevent tipping and ensure safety caps are always in place when not in use.</p>
        
        <h3>7. Use Certified Appliances</h3>
        <p>Only use gas appliances that carry safety certifications and are installed by licensed professionals. Look for certifications from recognized bodies like AGA, CGA, or UL.</p>
        
        <h3>8. Regular Hose Inspections</h3>
        <p>Check gas hoses regularly for cracks, wear, or damage. Replace them every 5 years or when showing signs of deterioration. Use only approved gas hoses with proper safety certifications.</p>
        
        <h3>9. Keep Flammable Materials Away</h3>
        <p>Maintain a safe distance between gas appliances and flammable materials like curtains, paper, and cleaning supplies. The recommended safe distance is at least 3 feet from combustible materials.</p>
        
        <h3>10. Educate Family Members</h3>
        <p>Ensure all household members understand basic gas safety rules and emergency procedures. Conduct regular family safety drills and keep emergency numbers posted in visible locations.</p>
        
        <div class="article-note">
          <FaExclamationTriangle /> <strong>Emergency Contact:</strong> If you suspect a gas leak, evacuate immediately and call your gas provider's emergency line from a safe location.
        </div>
      `,
      image: "https://media.istockphoto.com/id/2015197442/photo/gas-bottle-passed-safety-inspection-bright-background-with-safe-sticker-and-documents.jpg?s=612x612&w=0&k=20&c=CFnl2YD3jwRuVRPPcziYFnesYsFDDu4KnJBzsYZCjOU=",
      date: "June 15, 2023",
      author: "Sarah Johnson",
      readTime: "8 min read",
      tags: ["Safety", "Tips", "Home", "Maintenance", "Emergency"],
      category: "Safety Tips",
      featured: true,
      likes: 42,
      comments: 15
    },
    {
      id: 2,
      title: "Why Professional Chefs Prefer Cooking with Gas",
      excerpt: "Discover the reasons why gas cooking is preferred by culinary experts worldwide and how it can transform your home cooking experience...",
      content: `
        <h2>The Chef's Choice: Gas Cooking</h2>
        <p>In professional kitchens worldwide, gas cooktops reign supreme. A recent survey of 500 professional chefs revealed that 92% prefer gas over induction or electric cooking. Here's why this preference exists and what it means for your home kitchen.</p>
        
        <h3>Instant Heat Control</h3>
        <p>Gas burners provide immediate response when adjusting temperature. This instant control allows chefs to make precise adjustments crucial for delicate sauces and perfect searing. Unlike electric cooktops that take time to heat up and cool down, gas responds instantly to knob turns.</p>
        <ul>
          <li>Millisecond response time to adjustments</li>
          <li>Precise temperature control for delicate tasks</li>
          <li>No residual heat after turning off</li>
          <li>Perfect for techniques requiring quick temperature changes</li>
        </ul>
        
        <h3>Even Heat Distribution</h3>
        <p>Gas flames wrap around cookware, providing uniform heating that eliminates hot spots and ensures consistent cooking results. This wraparound effect is particularly beneficial for dishes requiring even cooking across the entire surface.</p>
        <div class="article-note">
          <strong>Pro Tip:</strong> For the most even heating, use heavy-bottomed pans that distribute heat efficiently across their entire surface.
        </div>
        
        <h3>Visual Flame Indicator</h3>
        <p>The visible flame gives immediate feedback about heat intensity, allowing for intuitive temperature management without guessing. Chefs can tell the heat level just by looking at the flame size and color, enabling them to cook multiple dishes simultaneously with perfect timing.</p>
        
        <h3>Better for Specific Techniques</h3>
        <p>Gas excels at techniques like wok cooking, flambéing, and charring that require direct flame contact and rapid heat changes. Traditional cooking methods from various cuisines were developed specifically for open flame cooking.</p>
        <ul>
          <li>Wok hei - the essential breath of the wok in Chinese cooking</li>
          <li>Direct charring of vegetables and meats</li>
          <li>Flambéing for both flavor and presentation</li>
          <li>Rotisserie and spit roasting</li>
        </ul>
        
        <h3>Cost-Effective Operation</h3>
        <p>Gas typically costs 30-50% less than electricity for cooking, making it more economical for high-volume professional kitchens. For home cooks, this translates to significant savings on utility bills over time.</p>
        
        <h3>Reliability During Power Outages</h3>
        <p>Gas cooktops continue working during electrical outages, ensuring uninterrupted kitchen operations. This reliability is crucial for both professional kitchens and home cooks who need to prepare meals regardless of weather conditions.</p>
        
        <h3>Superior for High-Heat Cooking</h3>
        <p>Gas burners can achieve higher temperatures faster than most electric alternatives, making them ideal for searing, boiling water quickly, and other high-heat cooking methods essential in professional kitchens.</p>
        
        <div class="article-note">
          <FaFire /> <strong>Did You Know?</strong> Many culinary schools worldwide require students to learn on gas equipment first, as it teaches fundamental heat control skills that translate to any cooking method.
        </div>
      `,
      image: "https://media.istockphoto.com/id/2200065927/photo/professional-chef-cooking-and-stirring-food-in-a-pan-in-a-commercial-kitchen.jpg?s=612x612&w=0&k=20&c=q8g5mHu0t2sc7GyREroEQ35fswKGaDsCQ6gYCWIWjWk=",
      date: "June 8, 2023",
      author: "Chef Marco Rodriguez",
      readTime: "6 min read",
      tags: ["Cooking", "Tips", "Professional", "Kitchen", "Chef"],
      category: "Cooking Guides",
      featured: true,
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: "How to Make Your Kitchen More Energy Efficient",
      excerpt: "Simple changes to your cooking habits and kitchen setup can significantly reduce your energy consumption and utility bills. Learn how...",
      content: `
        <h2>Energy Efficiency in the Kitchen</h2>
        <p>Transforming your kitchen into an energy-efficient space not only saves money but also reduces your environmental footprint. The average household can save up to $100 annually by implementing these simple gas efficiency strategies.</p>
        
        <h3>Smart Appliance Usage</h3>
        <p>Use the right-sized burners for your cookware. A small pan on a large burner wastes up to 40% of the heat generated. Match your pan size to the burner size to maximize heat transfer and minimize energy waste.</p>
        <ul>
          <li>Small burners for small pans (1-3 quarts)</li>
          <li>Medium burners for medium pans (4-6 quarts)</li>
          <li>Large burners only for large pots and stockpots</li>
          <li>Use simmer burners for prolonged gentle cooking</li>
        </ul>
        
        <h3>Proper Cookware Selection</h3>
        <p>Choose heavy-bottomed pans with flat bases that make full contact with the burner surface for maximum heat transfer. Copper-bottomed and clad stainless steel pans offer excellent heat conductivity and distribution.</p>
        <div class="article-note">
          <strong>Efficiency Test:</strong> Place a ruler across the bottom of your pan. If light shows underneath, the pan isn't making full contact with the burner.
        </div>
        
        <h3>Lid Usage Matters</h3>
        <p>Always use lids when cooking. This simple practice can reduce cooking time and energy use by up to 60%. A tight-fitting lid traps heat and moisture, cooking food faster and more evenly.</p>
        
        <h3>Regular Maintenance</h3>
        <p>Clean burners and reflectors regularly. Dirty burners can reduce efficiency by up to 15%. Ensure burner ports are clear of food debris and the flame burns blue with yellow tips.</p>
        <ul>
          <li>Clean burner caps weekly</li>
          <li>Check for clogged ports monthly</li>
          <li>Ensure proper flame color (mostly blue with yellow tips)</li>
          <li>Clean reflectors to maximize heat reflection</li>
        </ul>
        
        <h3>Pressure Cooking Benefits</h3>
        <p>Use pressure cookers for appropriate dishes. They can reduce cooking time and energy use by 50-70%. Modern pressure cookers are safe, efficient, and perfect for beans, stews, and tough cuts of meat.</p>
        
        <h3>Batch Cooking Strategy</h3>
        <p>Cook multiple items at once when possible. An already-hot oven or burner uses less energy than starting from cold. Plan your weekly cooking to maximize efficiency.</p>
        
        <h3>Optimize Preheating Times</h3>
        <p>Only preheat when necessary. Most stovetop cooking doesn't require extensive preheating. For ovens, modern models heat quickly, so reduce preheating time when possible.</p>
        
        <h3>Use Residual Heat</h3>
        <p>Turn off burners a few minutes before cooking is complete. The residual heat will finish the cooking process without using additional gas.</p>
        
        <div class="article-note">
          <FaBolt /> <strong>Quick Fact:</strong> Implementing these tips can reduce your kitchen's gas consumption by up to 30%, saving both money and the environment.
        </div>
      `,
      image: "https://media.istockphoto.com/id/2198014033/photo/a-traditional-dutch-clean-domestic-kitchen.jpg?s=612x612&w=0&k=20&c=Ei_lqsW1K9n7WonGU1nr1Yg3mjl8YlY_XjAlt7ETw_4=",
      date: "May 30, 2023",
      author: "Dr. Emily Chen",
      readTime: "7 min read",
      tags: ["Energy", "Efficiency", "Savings", "Kitchen", "Eco-friendly"],
      category: "Energy Efficiency",
      likes: 29,
      comments: 8
    },
    {
      id: 4,
      title: "The Ultimate Guide to Gas Appliance Maintenance",
      excerpt: "Regular maintenance extends the life of your gas appliances and ensures safe operation. Our comprehensive guide shows you what to do...",
      content: `
        <h2>Comprehensive Gas Appliance Care</h2>
        <p>Proper maintenance of gas appliances is crucial for safety, efficiency, and longevity. Well-maintained appliances can last 50% longer and operate 25% more efficiently than neglected ones.</p>
        
        <h3>Monthly Maintenance Tasks</h3>
        <p>These simple checks take only minutes but can prevent major issues and ensure optimal performance.</p>
        <ul>
          <li><strong>Visual inspection</strong> of burners and flames - should be blue with yellow tips</li>
          <li><strong>Check for unusual odors</strong> or sounds during operation</li>
          <li><strong>Clean surface spills</strong> and debris immediately</li>
          <li><strong>Test ignition systems</strong> for proper operation</li>
          <li><strong>Verify pilot lights</strong> (if applicable) are burning steadily</li>
        </ul>
        
        <h3>Quarterly Deep Cleaning</h3>
        <p>Every three months, perform a more thorough cleaning to maintain efficiency and safety.</p>
        <div class="article-note">
          <strong>Safety First:</strong> Always turn off the gas supply and ensure appliances are completely cool before performing deep cleaning.
        </div>
        <ul>
          <li>Remove and clean burner caps and grates with warm, soapy water</li>
          <li>Clean ignition systems with a soft brush</li>
          <li>Check gas connections for tightness (do not overtighten)</li>
          <li>Clean thermostat sensors and safety valves</li>
          <li>Inspect gas lines for signs of wear or damage</li>
        </ul>
        
        <h3>Annual Professional Service</h3>
        <p>Schedule professional inspections that include comprehensive testing and adjustments.</p>
        <ul>
          <li><strong>Combustion analysis</strong> to ensure proper air-fuel mixture</li>
          <li><strong>Gas pressure checks</strong> at the appliance and meter</li>
          <li><strong>Safety device testing</strong> including flame failure devices</li>
          <li><strong>Ventilation system inspection</strong> for blockages or damage</li>
          <li><strong>Heat exchanger inspection</strong> for furnaces and boilers</li>
          <li><strong>Efficiency testing</strong> and calibration if needed</li>
        </ul>
        
        <h3>Seasonal Maintenance Checklist</h3>
        <p>Different seasons require specific maintenance attention for optimal performance.</p>
        
        <h4>Spring Maintenance</h4>
        <ul>
          <li>Check outdoor gas lines for winter damage</li>
          <li>Service gas grills and outdoor cooking equipment</li>
          <li>Inspect and clean gas fireplace components</li>
        </ul>
        
        <h4>Fall Maintenance</h4>
        <ul>
          <li>Service heating systems before cold weather</li>
          <li>Check furnace filters and replace if needed</li>
          <li>Test carbon monoxide detectors</li>
          <li>Inspect venting systems for nests or blockages</li>
        </ul>
        
        <h3>Signs You Need Immediate Attention</h3>
        <p>Recognize these warning signs that indicate your appliance needs professional service immediately.</p>
        <ul>
          <li><strong>Yellow or orange flames</strong> (should be mostly blue)</li>
          <li><strong>Soot buildup</strong> around appliances or on walls</li>
          <li><strong>Unusual noises</strong> during operation (popping, rumbling)</li>
          <li><strong>Pilot lights</strong> that frequently go out</li>
          <li><strong>Gas odor</strong> even when appliances are off</li>
          <li><strong>Increased condensation</strong> on windows</li>
          <li><strong>Headaches or nausea</strong> that improve when leaving home</li>
        </ul>
        
        <h3>Maintenance Log Template</h3>
        <p>Keep a simple log to track your maintenance activities:</p>
        <div class="article-note">
          <strong>Sample Maintenance Log:</strong><br/>
          • Date of service<br/>
          • Type of maintenance performed<br/>
          • Parts replaced (if any)<br/>
          • Service provider name<br/>
          • Next scheduled maintenance date<br/>
          • Notes or observations
        </div>
        
        <div class="article-note">
          <FaTools /> <strong>Professional Tip:</strong> Always use certified technicians for gas appliance repairs. DIY repairs on gas systems can be dangerous and may void warranties.
        </div>
      `,
      image: "https://media.istockphoto.com/id/1093111438/photo/regulator-for-propane-butane-gas-cylinder-and-accessories-on-a-wooden-workshop-table-gas.jpg?s=612x612&w=0&k=20&c=ZVBEOsj2A6_HH0XfrYqkg6gjgkvADP1bgxI0qMNlCkc=",
      date: "May 22, 2023",
      author: "Michael Thompson",
      readTime: "10 min read",
      tags: ["Maintenance", "Guide", "Appliances", "Safety", "DIY"],
      category: "Maintenance",
      likes: 35,
      comments: 11
    },
    {
      id: 5,
      title: "How e-GAS Supports Restaurant Businesses",
      excerpt: "Discover how our specialized business solutions help restaurants maintain uninterrupted service and manage their gas needs efficiently...",
      content: `
        <h2>e-GAS: Your Restaurant's Reliable Partner</h2>
        <p>Restaurants depend on consistent gas supply for their operations. e-GAS provides tailored solutions for the food service industry, helping over 500 restaurants across the region maintain seamless operations and optimize their energy costs.</p>
        
        <h3>24/7 Emergency Delivery</h3>
        <p>Never run out of gas during service hours. Our emergency delivery service ensures you're always stocked, with average response times under 2 hours during business hours.</p>
        <ul>
          <li>Dedicated emergency hotline for restaurant clients</li>
          <li>Priority scheduling for food service businesses</li>
          <li>After-hours and weekend emergency service</li>
          <li>Real-time tracking of delivery vehicles</li>
        </ul>
        
        <h3>Bulk Pricing Options</h3>
        <p>Special rates for high-volume users help restaurants manage their operational costs effectively. Our tiered pricing structure rewards consistent usage with significant savings.</p>
        <div class="article-note">
          <strong>Cost Savings:</strong> Restaurants using our bulk pricing program save an average of 25% on their gas costs compared to standard commercial rates.
        </div>
        
        <h3>Regular Maintenance Contracts</h3>
        <p>Scheduled maintenance plans keep your equipment running efficiently and safely. Our certified technicians understand the unique demands of commercial kitchens.</p>
        <ul>
          <li>Quarterly safety inspections</li>
          <li>Priority service scheduling</li>
          <li>Discounted repair rates</li>
          <li>Comprehensive equipment testing</li>
          <li>Emergency repair guarantees</li>
        </ul>
        
        <h3>Kitchen Efficiency Audits</h3>
        <p>Our experts analyze your gas usage patterns and recommend efficiency improvements that can reduce your energy costs by up to 30%.</p>
        
        <h4>Audit Process Includes:</h4>
        <ul>
          <li>Equipment efficiency assessment</li>
          <li>Usage pattern analysis</li>
          <li>Ventilation system evaluation</li>
          <li>Heat recovery opportunities</li>
          <li>Customized efficiency report</li>
        </ul>
        
        <h3>Training for Kitchen Staff</h3>
        <p>Comprehensive training on safe gas handling and efficient cooking practices. Well-trained staff can improve kitchen efficiency by 15-20%.</p>
        
        <h4>Training Modules Include:</h4>
        <ul>
          <li>Proper burner usage and heat management</li>
          <li>Emergency procedures and safety protocols</li>
          <li>Efficient cooking techniques</li>
          <li>Equipment maintenance basics</li>
          <li>Energy conservation practices</li>
        </ul>
        
        <h3>Customized Delivery Schedules</h3>
        <p>We work around your business hours to minimize disruption. Early morning, late evening, or scheduled off-peak deliveries ensure your kitchen operations continue uninterrupted.</p>
        
        <h3>Equipment Financing and Leasing</h3>
        <p>Access to the latest energy-efficient gas equipment through our flexible financing and leasing programs. Upgrade your kitchen without significant upfront investment.</p>
        
        <h3>Case Study: Bella Napoli Restaurant</h3>
        <p>After implementing our comprehensive service package, Bella Napoli achieved:</p>
        <ul>
          <li>28% reduction in monthly gas costs</li>
          <li>Zero service interruptions in 18 months</li>
          <li>15% faster cooking times with optimized equipment</li>
          <li>$8,500 annual savings through efficiency improvements</li>
        </ul>
        
        <div class="article-note">
          <FaIndustry /> <strong>Business Advantage:</strong> Our restaurant clients report an average 95% satisfaction rate with our reliability and service quality.
        </div>
      `,
      image: "https://media.istockphoto.com/id/1063806806/photo/portugal.jpg?s=612x612&w=0&k=20&c=lLIDczr31Dvo0xTjaBSvm7eB-jOq5D2ALa9M1lPjm40=",
      date: "May 15, 2023",
      author: "David Martinez",
      readTime: "5 min read",
      tags: ["Business", "Restaurant", "Solutions", "Commercial", "Efficiency"],
      category: "Business Solutions",
      likes: 27,
      comments: 6
    },
    {
      id: 6,
      title: "The Role of LPG in Sustainable Energy Solutions",
      excerpt: "Learn how liquefied petroleum gas (LPG) serves as a cleaner alternative to traditional fuels and contributes to environmental sustainability...",
      content: `
        <h2>LPG: A Bridge to Sustainable Energy</h2>
        <p>Liquefied Petroleum Gas plays a crucial role in the transition to cleaner energy sources while maintaining reliability and affordability. As the world moves toward decarbonization, LPG offers immediate environmental benefits over more polluting alternatives.</p>
        
        <h3>Lower Carbon Emissions</h3>
        <p>LPG produces up to 20% less CO2 than oil and 50% less than coal, making it a cleaner fossil fuel alternative. When compared to electricity generated from coal, LPG can reduce greenhouse gas emissions by up to 70%.</p>
        <ul>
          <li>15-20% lower CO2 emissions than heating oil</li>
          <li>50% lower CO2 emissions than coal</li>
          <li>Almost zero particulate matter emissions</li>
          <li>Lower nitrogen oxide emissions than diesel</li>
        </ul>
        
        <h3>Reduced Particulate Matter</h3>
        <p>Unlike wood or coal, LPG burns cleanly with minimal particulate emissions, improving air quality. This is particularly important in urban areas and for indoor air quality.</p>
        <div class="article-note">
          <strong>Health Impact:</strong> Switching from solid fuels to LPG for cooking can reduce childhood pneumonia cases by up to 50% according to WHO studies.
        </div>
        
        <h3>Energy Efficiency</h3>
        <p>LPG has a high energy content and efficient combustion, meaning less fuel is needed to produce the same amount of energy. This efficiency translates to lower overall consumption and reduced environmental impact.</p>
        
        <h4>Comparative Efficiency Rates:</h4>
        <ul>
          <li>LPG: 90-95% combustion efficiency</li>
          <li>Electricity (grid): 30-40% overall efficiency</li>
          <li>Heating oil: 80-85% efficiency</li>
          <li>Coal: 60-70% efficiency</li>
        </ul>
        
        <h3>Renewable Integration</h3>
        <p>LPG can complement intermittent renewable sources by providing reliable backup power. This hybrid approach ensures energy security while maximizing renewable energy usage.</p>
        
        <h4>Hybrid System Benefits:</h4>
        <ul>
          <li>LPG backup for solar during cloudy periods</li>
          <li>Reliable power when wind resources are low</li>
          <li>Quick-start capability for demand peaks</li>
          <li>Reduced battery storage requirements</li>
        </ul>
        
        <h3>Transition Fuel</h3>
        <p>As we move toward fully renewable energy systems, LPG serves as an important transition fuel that's cleaner than alternatives. It provides the reliability needed while renewable infrastructure develops.</p>
        
        <h3>BioLPG: The Renewable Future</h3>
        <p>BioLPG, produced from renewable sources, offers the same benefits as conventional LPG but with up to 80% lower carbon emissions. This drop-in replacement requires no equipment modifications.</p>
        
        <h4>BioLPG Production Sources:</h4>
        <ul>
          <li>Agricultural waste and residues</li>
          <li>Used cooking oil and animal fats</li>
          <li>Organic municipal waste</li>
          <li>Specialized energy crops</li>
        </ul>
        
        <h3>LPG in Circular Economy</h3>
        <p>LPG production increasingly incorporates waste materials and by-products, contributing to circular economy principles and reducing overall waste.</p>
        
        <h3>Global Sustainability Impact</h3>
        <p>In developing countries, LPG provides a clean cooking alternative to wood and charcoal, reducing deforestation and indoor air pollution while improving health outcomes.</p>
        
        <div class="article-note">
          <FaLeaf /> <strong>Sustainability Fact:</strong> Switching 1 million households from wood to LPG for cooking can save approximately 5,000 hectares of forest annually.
        </div>
        
        <h3>Future Outlook</h3>
        <p>The LPG industry is committed to achieving carbon neutrality through technological innovations, increased renewable content, and carbon offset programs.</p>
        
        <div class="article-note">
          <strong>Industry Commitment:</strong> The global LPG industry has pledged to achieve 100% renewable LPG production by 2050 through advanced biofuel technologies.
        </div>
      `,
      image: "https://media.istockphoto.com/id/477395027/photo/eco-gas-tank-concept.jpg?s=612x612&w=0&k=20&c=7bb7Eg8boTwswSPRy7aPDwgW7A2IsHu9Ygg6N2dCA0c=",
      date: "May 5, 2023",
      author: "Dr. Lisa Wang",
      readTime: "6 min read",
      tags: ["Sustainability", "Environment", "LPG", "Energy", "Eco-friendly"],
      category: "Industry News",
      likes: 31,
      comments: 9
    }
  ];

  useEffect(() => {
    // Find the current article
    const currentArticle = blogPosts.find(post => post.id === parseInt(id));
    setArticle(currentArticle);
    
    if (currentArticle) {
      setLikesCount(currentArticle.likes);
      
      // Find related posts (same category, excluding current)
      const related = blogPosts.filter(
        post => post.category === currentArticle.category && post.id !== currentArticle.id
      ).slice(0, 3);
      setRelatedPosts(related);
    }
  }, [id]);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    const text = article?.excerpt || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareMenu(false);
  };

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/blog')} className="blog-back-btn">
          <FaArrowLeft /> Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="article-page">
      {/* Breadcrumb */}
      <nav className="article-breadcrumb">
        <a href="/"><FaHome className="article-breadcrumb-icon" /> Home</a>
        <span className="article-breadcrumb-separator"><FaArrowRight /></span>
        <a href="/blog">Blog</a>
        <span className="article-breadcrumb-separator"><FaArrowRight /></span>
        <span className="article-current-page">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-header-content">
          <div className="article-meta-top">
            <span className="article-category">
              <FaFolder className="article-meta-icon" /> {article.category}
            </span>
            <div className="article-meta-details">
              <span><FaCalendar className="article-meta-icon" /> {article.date}</span>
              <span><FaUser className="article-meta-icon" /> {article.author}</span>
              <span><FaClock className="article-meta-icon" /> {article.readTime}</span>
            </div>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="article-tag">
                <FaTag className="article-tag-icon" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Article Hero Image */}
      <div className="article-hero">
        <img src={article.image} alt={article.title} className="article-hero-image" />
      </div>

      {/* Main Content */}
      <div className="article-container">
        <main className="article-main">
          {/* Article Content */}
          <article className="article-content">
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Article Actions */}
          <div className="article-actions">
            <div className="article-actions-left">
              <button 
                className={`article-like-btn ${isLiked ? 'article-liked' : ''}`}
                onClick={handleLike}
              >
                <FaHeart /> {likesCount}
              </button>
              <button className="article-comment-btn">
                <FaComment /> {article.comments} Comments
              </button>
            </div>
            
            <div className="article-actions-right">
              <div className="article-share-container">
                <button 
                  className="article-share-btn"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <FaShare /> Share
                </button>
                
                {showShareMenu && (
                  <div className="article-share-menu">
                    <button onClick={() => handleShare('facebook')}>
                      <FaFacebook /> Facebook
                    </button>
                    <button onClick={() => handleShare('twitter')}>
                      <FaTwitter /> Twitter
                    </button>
                    <button onClick={() => handleShare('linkedin')}>
                      <FaLinkedin /> LinkedIn
                    </button>
                    <button onClick={() => handleShare('whatsapp')}>
                      <FaWhatsapp /> WhatsApp
                    </button>
                    <button onClick={copyToClipboard}>
                      <FaShare /> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="article-author">
            <div className="author-avatar">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random&size=64`} 
                alt={article.author}
              />
            </div>
            <div className="author-info">
              <h3>About the Author</h3>
              <h4>{article.author}</h4>
              <p>
                {article.author === "Sarah Johnson" && "Certified gas safety expert with 15 years of experience in residential and commercial gas systems."}
                {article.author === "Chef Marco Rodriguez" && "Award-winning executive chef and culinary educator specializing in professional kitchen equipment and techniques."}
                {article.author === "Dr. Emily Chen" && "Energy efficiency consultant and researcher focused on sustainable kitchen technologies and practices."}
                {article.author === "Michael Thompson" && "Licensed gas technician and maintenance specialist with expertise in appliance longevity and safety."}
                {article.author === "David Martinez" && "Business solutions manager helping restaurants optimize their operations and reduce costs."}
                {article.author === "Dr. Lisa Wang" && "Environmental scientist and sustainability advocate specializing in clean energy transitions."}
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="article-sidebar">
          {/* Table of Contents */}
          <div className="article-toc">
            <h3>In This Article</h3>
            <nav className="toc-nav">
              {article.content.split('<h3>').slice(1).map((section, index) => {
                const title = section.split('</h3>')[0].replace(/^\d+\.\s*/, '');
                return (
                  <a 
                    key={index} 
                    href={`#section-${index + 1}`}
                    className="toc-link"
                  >
                    {index + 1}. {title}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="article-related-posts">
              <h3>Related Articles</h3>
              <div className="related-posts-list">
                {relatedPosts.map(post => (
                  <div key={post.id} className="related-post">
                    <div className="related-post-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="related-post-content">
                      <h4>
                        <a href={`/blog/${post.id}`}>{post.title}</a>
                      </h4>
                      <div className="related-post-meta">
                        <FaCalendar className="article-meta-icon" /> {post.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="article-newsletter">
            <h3>Stay Updated</h3>
            <p>Get the latest articles and tips delivered to your inbox.</p>
            <form className="article-newsletter-form">
              <div className="article-newsletter-input-group">
                <FaEnvelope className="article-newsletter-icon" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="article-newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="article-newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Navigation */}
      <div className="article-navigation">
        <button 
          className="article-nav-btn article-nav-prev"
          onClick={() => navigate('/blog')}
        >
          <FaArrowLeft /> Back to Blog
        </button>
        
        <button 
          className="article-nav-btn article-nav-next"
          onClick={() => {
            const nextId = parseInt(id) + 1;
            const nextArticle = blogPosts.find(post => post.id === nextId);
            if (nextArticle) {
              navigate(`/blog/${nextId}`);
            }
          }}
          disabled={!blogPosts.find(post => post.id === parseInt(id) + 1)}
        >
          Next Article <FaArrowRight />
        </button>
      </div>

      {/* Newsletter CTA */}
      <section className="article-newsletter-cta">
        <div className="article-newsletter-cta-content">
          <h2>Enjoyed this article?</h2>
          <p>Subscribe to our newsletter for more expert tips and industry insights.</p>
          <form className="article-newsletter-cta-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="article-newsletter-cta-input"
              required
            />
            <button type="submit" className="article-newsletter-cta-btn">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Article;