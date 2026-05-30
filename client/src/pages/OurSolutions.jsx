import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { 
  Code, 
  Palette, 
  PenTool, 
  Megaphone, 
  BookOpen, 
  Languages, 
  ShieldCheck, 
  Clock, 
  Zap, 
  HelpCircle,
  ArrowRight,
  Plus,
  Search,
  Check,
  DollarSign,
  AlertCircle,
  Briefcase,
  FileText,
  Wallet,
  ExternalLink,
  X,
  User,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

// Pre-populated realistic student-focused starter projects
const INITIAL_PROJECTS = [
  {
    id: "p1",
    title: "React Portfolio Website",
    clientName: "Aarav K. (TechFlow)",
    clientVpa: "aarav@oksbi",
    category: "Web Development",
    budget: 8000,
    duration: "5 days",
    description: "Looking for a React developer to build a modern single-page portfolio with clean transitions and contact form integration. Design must look premium and work on mobile screens.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    status: "OPEN", // OPEN, IN_PROGRESS, COMPLETED
    freelancerId: null,
    freelancerName: null,
    submission: null
  },
  {
    id: "p2",
    title: "Branding & Logo for Organic Cafe",
    clientName: "Nisha Patel (GreenGlow)",
    clientVpa: "nisha@okaxis",
    category: "Graphic Design",
    budget: 3500,
    duration: "3 days",
    description: "Need a modern, minimal logo design and color palette for a newly opening organic cafe. Deliverables must include vector SVG source files and brand guidelines sheet.",
    tags: ["Illustrator", "Branding", "Vector Graphic"],
    status: "OPEN",
    freelancerId: null,
    freelancerName: null,
    submission: null
  },
  {
    id: "p3",
    title: "Python Web Scraper Script",
    clientName: "Dr. Ramesh (ScienceLabs)",
    clientVpa: "ramesh@okicici",
    category: "Programming",
    budget: 5000,
    duration: "2 days",
    description: "Build a Python script using BeautifulSoup or Scrapy to extract product details from educational website tables. Output should be formatted as clean JSON.",
    tags: ["Python", "Web Scraping", "JSON"],
    status: "OPEN",
    freelancerId: null,
    freelancerName: null,
    submission: null
  },
  {
    id: "p4",
    title: "Copywriting for E-Commerce Checkout",
    clientName: "Sanjay M. (ShopEasy)",
    clientVpa: "sanjay@okhdfc",
    category: "Content Writing",
    budget: 2500,
    duration: "4 days",
    description: "Need a writer to craft persuasive microcopy for our cart and checkout pages to decrease funnel dropoffs. Experience in UX writing is preferred.",
    tags: ["UX Writing", "Copywriting", "E-Commerce"],
    status: "OPEN",
    freelancerId: null,
    freelancerName: null,
    submission: null
  }
];

// Pre-populated student profiles for simulated proposals
const SIMULATED_FREELANCERS = [
  { name: "Rahul Sharma", college: "BITS Pilani", rating: 4.8, proposal: "Hey! I have built over 5 React projects and can deliver this in 3 days with clean, responsive styling. Check out my GitHub profile." },
  { name: "Priya Das", college: "IIT Delhi", rating: 4.9, proposal: "I specialize in Tailwind layouts and Framer Motion transitions. I will ensure a premium design layout matching your exact requirements." },
  { name: "Aman Gupta", college: "DTU Delhi", rating: 4.6, proposal: "I am a frontend enthusiast and would love to work on this. I will provide 3 revision rounds and host it on Vercel for you." }
];

export default function OurSolutions() {
  const { user, setUser } = useAuth();
  
  // Role selection: "freelancer" or "client"
  const [role, setRole] = useState(() => localStorage.getItem("freelance_role") || "freelancer");
  
  // Wallet: Local fallback balance if user is not authenticated
  const [localBalance, setLocalBalance] = useState(() => {
    const saved = localStorage.getItem("freelance_local_balance");
    return saved ? Number(saved) : 15000;
  });

  // Escrow balance holds locked funds for clients
  const [escrowBalance, setEscrowBalance] = useState(() => {
    const saved = localStorage.getItem("freelance_escrow_balance");
    return saved ? Number(saved) : 0;
  });

  // Projects list
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("freelance_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Proposals submitted
  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem("freelance_proposals");
    return saved ? JSON.parse(saved) : [];
  });

  // Categories list
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals / forms states
  const [activeProposalProject, setActiveProposalProject] = useState(null);
  const [proposalBid, setProposalBid] = useState("");
  const [proposalDays, setProposalDays] = useState("");
  const [proposalText, setProposalText] = useState("");
  
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCategory, setNewJobCategory] = useState("Web Development");
  const [newJobBudget, setNewJobBudget] = useState("");
  const [newJobDuration, setNewJobDuration] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobTags, setNewJobTags] = useState("");

  const [showSubmitWorkProject, setShowSubmitWorkProject] = useState(null);
  const [submitLink, setSubmitLink] = useState("");
  const [submitNotes, setSubmitNotes] = useState("");

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("freelance_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("freelance_local_balance", localBalance.toString());
  }, [localBalance]);

  useEffect(() => {
    localStorage.setItem("freelance_escrow_balance", escrowBalance.toString());
  }, [escrowBalance]);

  useEffect(() => {
    localStorage.setItem("freelance_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("freelance_proposals", JSON.stringify(proposals));
  }, [proposals]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Safe wallet accessor (handles logged in vs local simulated balance)
  const getWalletBalance = () => {
    return user ? Number(user.balance) : localBalance;
  };

  const updateWalletBalance = (amount, isAddition) => {
    if (user) {
      setUser((prevUser) => {
        const nextBalance = isAddition ? prevUser.balance + amount : prevUser.balance - amount;
        return {
          ...prevUser,
          balance: nextBalance
        };
      });
    } else {
      setLocalBalance((prev) => isAddition ? prev + amount : prev - amount);
    }
  };

  // Reset demo back to initial state
  const handleResetDemo = () => {
    setProjects(INITIAL_PROJECTS);
    setProposals([]);
    setEscrowBalance(0);
    setLocalBalance(15000);
    localStorage.removeItem("freelance_projects");
    localStorage.removeItem("freelance_proposals");
    localStorage.removeItem("freelance_escrow_balance");
    localStorage.removeItem("freelance_local_balance");
    showToast("Simulation database reset to default starter settings", "info");
  };

  // Freelancer action: Submit a proposal
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    if (!proposalBid || !proposalDays || !proposalText) {
      showToast("Please fill all proposal fields", "error");
      return;
    }

    const newProposal = {
      id: "prop_" + Date.now(),
      projectId: activeProposalProject.id,
      projectTitle: activeProposalProject.title,
      freelancerName: user ? user.name : "You (Guest Student)",
      freelancerCollege: "Your University",
      freelancerRating: 5.0,
      bidAmount: Number(proposalBid),
      deliveryTime: `${proposalDays} days`,
      proposalText: proposalText,
      status: "PENDING", // PENDING, ACCEPTED, DECLINED
      isSimulated: false
    };

    setProposals((prev) => [newProposal, ...prev]);
    setActiveProposalProject(null);
    setProposalBid("");
    setProposalDays("");
    setProposalText("");
    showToast("Proposal submitted successfully to client review queue!");
  };

  // Freelancer action: Submit active contract work
  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!submitLink || !submitNotes) {
      showToast("Please provide deliverable details", "error");
      return;
    }

    setProjects((prev) => 
      prev.map((proj) => {
        if (proj.id === showSubmitWorkProject.id) {
          return {
            ...proj,
            submission: {
              link: submitLink,
              notes: submitNotes,
              submittedAt: new Date().toLocaleDateString()
            }
          };
        }
        return proj;
      })
    );

    setShowSubmitWorkProject(null);
    setSubmitLink("");
    setSubmitNotes("");
    showToast("Work deliverables submitted. Client review pending.");
  };

  // Client action: Post a Job
  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobBudget || !newJobDuration || !newJobDesc) {
      showToast("Please fill all job fields", "error");
      return;
    }

    const budget = Number(newJobBudget);
    const balance = getWalletBalance();

    if (balance < budget) {
      showToast("Insufficient balance in your wallet to cover job escrow", "error");
      return;
    }

    // Deduct budget and place in escrow
    updateWalletBalance(budget, false);
    setEscrowBalance((prev) => prev + budget);

    const newProject = {
      id: "p_" + Date.now(),
      title: newJobTitle,
      clientName: user ? user.name : "You (Client Guest)",
      clientVpa: user ? user.vpa : "guest@okcloud",
      category: newJobCategory,
      budget: budget,
      duration: `${newJobDuration} days`,
      description: newJobDesc,
      tags: newJobTags.split(",").map(t => t.trim()).filter(t => t),
      status: "OPEN",
      freelancerId: null,
      freelancerName: null,
      submission: null
    };

    setProjects((prev) => [newProject, ...prev]);
    setShowPostJobModal(false);
    setNewJobTitle("");
    setNewJobBudget("");
    setNewJobDuration("");
    setNewJobDesc("");
    setNewJobTags("");

    showToast(`Project posted! ₹${budget} locked safely in Escrow.`);

    // Trigger simulated student proposals after 3 seconds to feel alive
    setTimeout(() => {
      const randomBids = SIMULATED_FREELANCERS.map((f, i) => ({
        id: `sim_prop_${Date.now()}_${i}`,
        projectId: newProject.id,
        projectTitle: newProject.title,
        freelancerName: f.name,
        freelancerCollege: f.college,
        freelancerRating: f.rating,
        bidAmount: Math.floor(budget * (0.85 + Math.random() * 0.25)), // Close to client budget
        deliveryTime: `${Math.floor(newJobDuration * 0.8 || 2)} days`,
        proposalText: f.proposal,
        status: "PENDING",
        isSimulated: true
      }));

      setProposals((prev) => [...randomBids, ...prev]);
      showToast(`Received ${SIMULATED_FREELANCERS.length} proposals on your job! Check review panel.`, "info");
    }, 3500);
  };

  // Client action: Accept a proposal / Hire freelancer
  const handleAcceptProposal = (proposal) => {
    // Check if the project is still open
    const targetProject = projects.find(p => p.id === proposal.projectId);
    if (!targetProject) return;

    if (targetProject.status !== "OPEN") {
      showToast("This project already has an active contract", "error");
      return;
    }

    // Update project state
    setProjects((prev) => 
      prev.map((proj) => {
        if (proj.id === proposal.projectId) {
          return {
            ...proj,
            status: "IN_PROGRESS",
            freelancerId: proposal.id,
            freelancerName: proposal.freelancerName,
            hiredBid: proposal.bidAmount
          };
        }
        return proj;
      })
    );

    // Update proposal states (accept this one, reject others for same project)
    setProposals((prev) => 
      prev.map((p) => {
        if (p.projectId === proposal.projectId) {
          return {
            ...p,
            status: p.id === proposal.id ? "ACCEPTED" : "DECLINED"
          };
        }
        return p;
      })
    );

    showToast(`Hired ${proposal.freelancerName}! Milestone escrow is active.`);
  };

  // Client action: Decline a proposal
  const handleDeclineProposal = (proposalId) => {
    setProposals((prev) => 
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            status: "DECLINED"
          };
        }
        return p;
      })
    );
    showToast("Proposal declined");
  };

  // Client action: Approve deliverables / Release Escrow Payout
  const handleApproveWork = (project) => {
    if (!project.submission) return;

    // Release escrow
    const payout = project.hiredBid || project.budget;
    setEscrowBalance((prev) => Math.max(0, prev - project.budget));

    // Update project status to completed
    setProjects((prev) => 
      prev.map((p) => {
        if (p.id === project.id) {
          return {
            ...p,
            status: "COMPLETED"
          };
        }
        return p;
      })
    );

    // If the freelancer is the current user, refund to balance
    const isUserFreelancer = project.freelancerName === (user ? user.name : "You (Guest Student)");
    if (isUserFreelancer) {
      updateWalletBalance(payout, true);
    }

    // Return rest of project budget (if bid was lower than posted budget) to client
    const refund = project.budget - payout;
    if (refund > 0) {
      updateWalletBalance(refund, true);
    }

    showToast(`Milestone approved! ₹${payout} released to ${project.freelancerName}.`);
  };

  // Filter projects by category and query
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = categoryFilter === "All" || proj.category === categoryFilter;
    const matchesSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate my freelancer stats
  const freelancerContracts = projects.filter(p => p.freelancerName === (user ? user.name : "You (Guest Student)"));
  const myApplications = proposals.filter(p => p.freelancerName === (user ? user.name : "You (Guest Student)"));

  // Calculate my client stats
  const clientProjects = projects.filter(p => p.clientName === (user ? user.name : "You (Client Guest)"));

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      {/* Toast alert */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[1000] p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-fade-in ${
          toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
          toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
          "bg-[#f3ece0] border-[rgba(216,208,200,0.7)] text-[#4a3d33]"
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
      )}

      {/* Header & Role Switcher */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[rgba(216,208,200,0.5)] pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2a1f17] mb-2">
              Our Freelance Workspace
            </h1>
            <p className="text-[#605850] text-sm md:text-base max-w-xl">
              Post projects, lock escrow milestones, submit work, and secure immediate bank account payouts inside our student gig ecosystem.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            {/* Wallet summary */}
            <div className="flex items-center gap-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-2xl px-5 py-3 shadow-sm w-full md:w-auto justify-between">
              <div className="flex items-center gap-3 text-sm">
                <Wallet className="w-5 h-5 text-[#c2652a]" />
                <div>
                  <p className="text-[10px] text-[#8c7e72] uppercase font-bold tracking-wider">Wallet Balance</p>
                  <p className="font-bold text-[#2a1f17] text-base">₹{getWalletBalance().toLocaleString("en-IN")}</p>
                </div>
              </div>
              
              {role === "client" && escrowBalance > 0 && (
                <div className="border-l border-[rgba(216,208,200,0.7)] pl-4 flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-[10px] text-[#8c7e72] uppercase font-bold tracking-wider">Locked Escrow</p>
                    <p className="font-bold text-green-600 text-base">₹{escrowBalance.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Role switcher toggle */}
            <div className="flex bg-[#f3ece0] border border-[rgba(216,208,200,0.7)] rounded-full p-1 w-full md:w-[320px] justify-between">
              <button 
                onClick={() => setRole("freelancer")}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                  role === "freelancer" ? "bg-[#c2652a] text-white shadow-sm" : "text-[#605850] hover:text-[#2a1f17]"
                }`}
              >
                Student Freelancer
              </button>
              <button 
                onClick={() => setRole("client")}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                  role === "client" ? "bg-[#c2652a] text-white shadow-sm" : "text-[#605850] hover:text-[#2a1f17]"
                }`}
              >
                Hire / Project Client
              </button>
            </div>
            
            <button 
              onClick={handleResetDemo}
              className="text-[10px] text-[#8c7e72] hover:text-[#c2652a] font-semibold flex items-center gap-1 mt-1 transition-colors self-end"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset database settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* FREELANCER VIEW */}
      {role === "freelancer" && (
        <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Filters, Stats, Active Contracts */}
          <div className="space-y-8 lg:col-span-1">
            {/* My Active Gigs Tracker */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-[rgba(216,208,200,0.3)] pb-3">
                <Briefcase className="w-5 h-5 text-[#c2652a]" />
                <h3 className="font-bold text-[#2a1f17] text-lg font-serif">Active Contracts</h3>
              </div>
              
              {freelancerContracts.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#8c7e72]">
                  <p>No active freelance contracts yet.</p>
                  <p className="text-xs mt-1">Apply for projects on the job board to get hired.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {freelancerContracts.map((proj) => (
                    <div key={proj.id} className="border border-[rgba(216,208,200,0.5)] rounded-2xl p-4 bg-[#faf5ee]/50 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-[#2a1f17]">{proj.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          proj.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          proj.submission ? "bg-blue-100 text-blue-800" :
                          "bg-[#c2652a]/10 text-[#c2652a]"
                        }`}>
                          {proj.status === "COMPLETED" ? "Paid" : proj.submission ? "Under Review" : "In Progress"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8c7e72]">Hired Bid: <span className="font-bold text-[#2a1f17]">₹{(proj.hiredBid || proj.budget).toLocaleString("en-IN")}</span></p>
                      
                      {proj.status !== "COMPLETED" && (
                        <button
                          onClick={() => setShowSubmitWorkProject(proj)}
                          className="w-full py-2 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-xl text-xs font-semibold transition"
                        >
                          {proj.submission ? "Resubmit Deliverables" : "Submit Deliverables"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Proposal Submissions */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-[rgba(216,208,200,0.3)] pb-3">
                <FileText className="w-5 h-5 text-[#c2652a]" />
                <h3 className="font-bold text-[#2a1f17] text-lg font-serif">My Proposals</h3>
              </div>
              
              {myApplications.length === 0 ? (
                <p className="text-center py-6 text-sm text-[#8c7e72]">No proposals submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myApplications.map((prop) => (
                    <div key={prop.id} className="text-xs border-b border-[rgba(216,208,200,0.3)] pb-3 last:border-0 last:pb-0 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[#2a1f17]">{prop.projectTitle}</h4>
                        <p className="text-[#8c7e72] mt-0.5">Bid: ₹{prop.bidAmount.toLocaleString("en-IN")} | {prop.deliveryTime}</p>
                      </div>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${
                        prop.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                        prop.status === "DECLINED" ? "bg-red-100 text-red-800" :
                        "bg-[#f3ece0] text-[#605850]"
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filters */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-[#2a1f17] text-lg font-serif mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Web Development", "Graphic Design", "Content Writing", "Programming", "Academic Tutoring"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      categoryFilter === cat 
                        ? "bg-[#c2652a]/10 text-[#c2652a] border border-[#c2652a]/30" 
                        : "bg-white border border-[rgba(216,208,200,0.7)] text-[#605850] hover:text-[#2a1f17]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Job Search and Open Board */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c7e72]" />
              <input
                type="text"
                placeholder="Search freelance jobs, tech stacks, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-2xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] shadow-sm transition"
              />
            </div>

            {/* Projects Feed */}
            <div className="space-y-4">
              <h2 className="font-bold text-xl text-[#2a1f17] font-serif">Open Project Board</h2>
              
              {filteredProjects.length === 0 ? (
                <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-12 text-center text-[#8c7e72] shadow-sm">
                  <AlertCircle className="w-12 h-12 text-[#c2652a] mx-auto mb-4" />
                  <p className="font-semibold">No matching projects found</p>
                  <p className="text-xs mt-1">Try resetting filters or adjusting search queries.</p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`bg-white rounded-3xl p-8 border shadow-sm flex flex-col justify-between transition-all ${
                      project.status !== "OPEN" ? "opacity-75 border-[rgba(216,208,200,0.4)]" : "border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/60 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-[#c2652a]/10 text-[#c2652a] px-3 py-1 rounded-full">
                            {project.category}
                          </span>
                          <h3 className="text-xl font-bold text-[#2a1f17] font-serif mt-2">
                            {project.title}
                          </h3>
                          <p className="text-xs text-[#8c7e72] mt-1">Posted by: {project.clientName}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#c2652a] font-serif">₹{project.budget.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-[#8c7e72] uppercase font-bold tracking-wider mt-0.5">Timeline: {project.duration}</p>
                        </div>
                      </div>

                      <p className="text-sm text-[#605850] leading-relaxed mb-6">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-[#faf5ee] border border-[rgba(216,208,200,0.5)] rounded-[6px] text-[#8c7e72]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-[rgba(216,208,200,0.3)] pt-4 mt-2">
                      <div className="text-xs text-[#8c7e72] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>Milestone Escrow Verified</span>
                      </div>

                      {project.status === "OPEN" ? (
                        <button
                          onClick={() => setActiveProposalProject(project)}
                          className="px-6 py-2.5 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-full text-xs font-semibold transition"
                        >
                          Submit Proposal
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Hired {project.freelancerName}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* CLIENT VIEW */}
      {role === "client" && (
        <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Post Job and Quick Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Post project CTA */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-6 shadow-sm text-center">
              <Plus className="w-12 h-12 text-[#c2652a] mx-auto mb-4" />
              <h3 className="font-bold text-[#2a1f17] text-lg font-serif mb-2">Need a Freelancer?</h3>
              <p className="text-xs text-[#8c7e72] mb-6">
                Post a contract, fund the escrow milestone, and get custom student proposals in minutes.
              </p>
              <button
                onClick={() => setShowPostJobModal(true)}
                className="w-full py-3 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-xl text-sm font-semibold shadow-sm transition"
              >
                Post a Freelance Project
              </button>
            </div>

            {/* Escrow Shield Info */}
            <div className="bg-[#f3ece0]/40 border border-[rgba(216,208,200,0.7)] rounded-3xl p-6">
              <div className="flex gap-3">
                <ShieldCheck className="w-8 h-8 text-[#c2652a] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#2a1f17] text-sm">Escrow Milestones Active</h4>
                  <p className="text-xs text-[#605850] mt-1 leading-relaxed">
                    Client funds are locked securely in our digital smart wallet. Work deliverables can be reviewed before releasing payouts, securing both freelancer and client trust.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Client Job Board & Proposals review */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Postings and Review Dashboard */}
            <div className="space-y-4">
              <h2 className="font-bold text-xl text-[#2a1f17] font-serif">My Posted Gigs</h2>
              
              {clientProjects.length === 0 ? (
                <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-3xl p-12 text-center text-[#8c7e72] shadow-sm">
                  <Briefcase className="w-12 h-12 text-[#c2652a] mx-auto mb-4" />
                  <p className="font-semibold">You haven't posted any jobs yet</p>
                  <p className="text-xs mt-1">Use the left panel button to post your first student contract.</p>
                </div>
              ) : (
                clientProjects.map((project) => {
                  const projectProposals = proposals.filter(p => p.projectId === project.id);
                  const isUserHired = project.status !== "OPEN";

                  return (
                    <div key={project.id} className="bg-white rounded-3xl border border-[rgba(216,208,200,0.7)] p-6 shadow-sm space-y-6">
                      <div className="flex justify-between items-start border-b border-[rgba(216,208,200,0.3)] pb-4">
                        <div>
                          <h3 className="font-bold text-lg text-[#2a1f17] font-serif">{project.title}</h3>
                          <p className="text-xs text-[#8c7e72] mt-0.5">Budget: ₹{project.budget.toLocaleString("en-IN")} | {project.duration}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          project.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          project.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                          "bg-[#c2652a]/10 text-[#c2652a]"
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      {/* Review Deliverable work */}
                      {project.status === "IN_PROGRESS" && project.submission && (
                        <div className="bg-[#f3ece0]/40 border border-[rgba(216,208,200,0.7)] rounded-2xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-xs text-[#c2652a] uppercase tracking-wider">Freelancer Submission</h4>
                            <span className="text-[10px] text-[#8c7e72]">Submitted: {project.submission.submittedAt}</span>
                          </div>
                          
                          <p className="text-xs text-[#605850] italic leading-relaxed">"{project.submission.notes}"</p>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <a 
                              href={project.submission.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs font-semibold text-[#c2652a] hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Deliverable Work</span>
                            </a>
                            
                            <button
                              onClick={() => handleApproveWork(project)}
                              className="px-4 py-2 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-lg text-xs font-semibold transition shadow-sm"
                            >
                              Approve & Release ₹{(project.hiredBid || project.budget).toLocaleString("en-IN")}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Proposals list */}
                      <div>
                        <h4 className="font-bold text-xs text-[#8c7e72] uppercase tracking-wider mb-3">
                          {isUserHired ? `Hired: ${project.freelancerName}` : `Proposals Received (${projectProposals.length})`}
                        </h4>

                        {!isUserHired && projectProposals.length === 0 && (
                          <p className="text-xs text-[#8c7e72] italic py-2">Awaiting student proposals. Bids appear in 3-5 seconds after posting...</p>
                        )}

                        {!isUserHired && projectProposals.map((prop) => (
                          <div key={prop.id} className="border border-[rgba(216,208,200,0.5)] rounded-2xl p-4 bg-[#faf5ee]/50 space-y-3 mb-3 last:mb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[#2a1f17]">{prop.freelancerName}</span>
                                  <span className="text-[10px] bg-white border border-[rgba(216,208,200,0.5)] rounded px-1.5 py-0.5 text-gray-500 font-medium">★ {prop.freelancerRating}</span>
                                </div>
                                <p className="text-[10px] text-[#8c7e72] mt-0.5">{prop.freelancerCollege}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#c2652a] text-sm">₹{prop.bidAmount.toLocaleString("en-IN")}</span>
                                <p className="text-[9px] text-[#8c7e72] tracking-wider mt-0.5">ETA: {prop.deliveryTime}</p>
                              </div>
                            </div>

                            <p className="text-xs text-[#605850] leading-relaxed">"{prop.proposalText}"</p>

                            {prop.status === "PENDING" && (
                              <div className="flex gap-2 justify-end pt-2">
                                <button
                                  onClick={() => handleDeclineProposal(prop.id)}
                                  className="px-3 py-1.5 border border-[rgba(216,208,200,0.7)] text-[#605850] hover:bg-gray-50 rounded-lg text-xs font-semibold transition"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleAcceptProposal(prop)}
                                  className="px-4 py-1.5 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-lg text-xs font-semibold transition shadow-sm"
                                >
                                  Hire Freelancer
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      )}

      {/* PROPOSAL DRAWER / MODAL (Freelancer Mode) */}
      {activeProposalProject && (
        <div className="fixed inset-0 z-[500] bg-[#2a1f17]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(216,208,200,0.7)] w-full max-w-lg p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveProposalProject(null)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-[#c2652a]/10 text-[#c2652a] px-3 py-1 rounded-full">
                {activeProposalProject.category}
              </span>
              <h3 className="text-2xl font-bold font-serif text-[#2a1f17] mt-3">Submit Proposal</h3>
              <p className="text-xs text-[#8c7e72] mt-1">Applying for: {activeProposalProject.title}</p>
            </div>

            <div className="bg-[#faf5ee] rounded-xl p-4 border border-[rgba(216,208,200,0.5)]">
              <p className="text-xs text-[#8c7e72] uppercase font-bold tracking-wider">Client Budget</p>
              <p className="font-bold text-lg text-[#2a1f17] mt-0.5">₹{activeProposalProject.budget.toLocaleString("en-IN")} | max {activeProposalProject.duration}</p>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">My Bid Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="500"
                    placeholder="Enter bid"
                    value={proposalBid}
                    onChange={(e) => setProposalBid(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Delivery Time (Days)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Days"
                    value={proposalDays}
                    onChange={(e) => setProposalDays(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Cover Pitch Letter</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Explain why you are the best fit for this project..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                Send Proposal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELIVERABLE WORK SUBMISSION MODAL (Freelancer Mode) */}
      {showSubmitWorkProject && (
        <div className="fixed inset-0 z-[500] bg-[#2a1f17]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(216,208,200,0.7)] w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setShowSubmitWorkProject(null)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-bold font-serif text-[#2a1f17]">Submit Deliverables</h3>
              <p className="text-xs text-[#8c7e72] mt-1">Project contract: {showSubmitWorkProject.title}</p>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Deliverable URL / Source Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/yourproject or figma link"
                  value={submitLink}
                  onChange={(e) => setSubmitLink(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Submission Notes</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe your implementation notes, updates, or instructions for the client..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                Submit Deliverables for Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POST A JOB MODAL (Client Mode) */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-[500] bg-[#2a1f17]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(216,208,200,0.7)] w-full max-w-lg p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowPostJobModal(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-bold font-serif text-[#2a1f17]">Post a Freelance Project</h3>
              <p className="text-xs text-[#8c7e72] mt-1">Hire a student freelancer with locked milestone escrow contracts.</p>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Frontend for E-Commerce startup"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Programming">Programming</option>
                    <option value="Academic Tutoring">Academic Tutoring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Days"
                    value={newJobDuration}
                    onChange={(e) => setNewJobDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Project Budget (₹)</label>
                <input
                  type="number"
                  required
                  min="500"
                  placeholder="Budget to be locked in Escrow"
                  value={newJobBudget}
                  onChange={(e) => setNewJobBudget(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Project Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detail project specifications, design expectations, tech stacks, or required files..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#605850] uppercase tracking-wider mb-2">Tags / Tech Stacks (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, CSS, Node, Figma"
                  value={newJobTags}
                  onChange={(e) => setNewJobTags(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#2a1f17] text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c2652a] text-white hover:bg-[#a55220] rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                Fund Escrow & Post Project
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
